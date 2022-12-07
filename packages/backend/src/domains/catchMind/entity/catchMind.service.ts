import { CatchMind, Player, Timer } from "./catchMind";
import { CatchMindEventAdapter } from "../outbound/CatchMindEvent.Adapter";
import { CatchMindEventPort } from "../outbound/catchMindEvent.port";
import { CatchMindRepositoryDataPort } from "../outbound/catchMind.repository.port";
import { CatchMindInputPort } from "../inbound/CatchMindInput.port";
import { CatchMindRepository } from "../outbound/catchMind.repository";
import { CatchMindToRoomAdapter } from "../outbound/catchMindToRoom.adapter";
import { CatchMindToRoom } from "../outbound/catchMindToRoom.port";
import { TimerRepository } from "../outbound/timer.repository";
import { TimerRepositoryDataPort } from "../outbound/timer.repository.port";

const MSEC_PER_SEC = 1000;

export class CatchMindService implements CatchMindInputPort {
  eventEmitter: CatchMindEventPort = new CatchMindEventAdapter();
  gameRepository: CatchMindRepositoryDataPort = new CatchMindRepository();
  timerRepository: TimerRepositoryDataPort = new TimerRepository();
  roomAPI: CatchMindToRoom = new CatchMindToRoomAdapter();

  async gameStart(
    goalScore: number,
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) {
    const game = new CatchMind({
      goalScore,
      players: players.map((id) => new Player(id)),
      roundTime,
      roomId,
      totalRound,
    });

    const { roundInfo } = game;
    this.eventEmitter.gameStart(game.roomId, {
      totalRound,
      roundInfo,
    });

    this.gameRepository.save(game);
  }

  async drawStart(roomId: string, keyword: string, playerId: string) {
    await this.gameRepository.getLock(roomId);
    const game = await this.gameRepository.findById(roomId);
    if (!game || !game.isTurnPlayer(playerId)) {
      this.gameRepository.release(roomId);
      return;
    }

    console.log("catch input keyword", roomId, keyword);

    game.keyword = keyword;
    this.eventEmitter.drawStart(game.roomId, game.turnPlayer);

    const timerId = setTimeout(() => {
      this.roundEnd(game.roomId, null);
    }, game.roundTime * MSEC_PER_SEC);

    const timer = new Timer(roomId, timerId);

    this.timerRepository.save(game.roomId, timer);
    this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async roundEnd(roomId: string, winner: string | null) {
    await this.gameRepository.getLock(roomId);
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }
    console.log("\x1b[36mround End catch\x1b[37m", roomId, winner);
    if (winner) game.addScore(winner);

    this.eventEmitter.roundEnd(game.roomId, {
      isLastRound: game.isGameEnded,
      suggestedWord: game.keyword,
      playerScoreMap: game.scoreMap,
      roundWinner: winner,
    });

    game.clearKeyword();

    this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async checkAnswer(roomId: string, answer: string, playerId: string) {
    await this.gameRepository.getLock(roomId);
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    if (game.isRightAnswer(answer, playerId)) {
      this.cancelTimer(roomId);
      this.roundEnd(roomId, playerId);
    }
    this.gameRepository.release(roomId);
  }

  async roundReady(roomId: string, playerId: string) {
    await this.gameRepository.getLock(roomId);
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      await this.gameRepository.getLock(roomId);
      return;
    }

    const player = game.findPlayer(playerId);

    if (player && !player.isReady) {
      this.eventEmitter.roundReady(game.roomId, player);
      game.ready(playerId);
    }

    if (game.isAllReady) {
      this.roundStart(game);
    }
    this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  roundStart(game: CatchMind) {
    game.nextTurn();
    this.eventEmitter.roundStart(game.roomId, game.roundInfo);
  }

  async exitGame(roomId: string, playerId: string) {
    await this.gameRepository.getLock(roomId);
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    if (game.isTurnPlayer(playerId)) {
      this.roundEnd(roomId, null);
      this.cancelTimer(roomId);
    }

    const result = game.exitGame(playerId);

    if (result) {
      this.eventEmitter.playerExit(roomId, playerId);
    }

    if (game.isAllExit) {
      console.log("\x1b[33mend game\x1b[37m", roomId);
      this.roomAPI.gameEnded(roomId);
      this.gameRepository.delete(roomId);
    } else {
      this.gameRepository.save(game);
    }

    this.gameRepository.release(roomId);
  }

  cancelTimer(roomId: string) {
    const timer = this.timerRepository.findById(roomId);
    if (!timer) return;

    clearTimeout(timer.timer);

    this.timerRepository.delete(roomId);
  }
}
