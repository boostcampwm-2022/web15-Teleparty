import { CatchMind, Player } from "../entity/catchMind";
import { CatchMindEventPresenter } from "../presenters/CatchMindEvent.presenter";
import { CatchMindEventPort } from "./catchMindEvent.port";
import { CatchMindRepositoryDataPort } from "./catchMind.repository.port";
import { CatchMindInputPort } from "./CatchMindInput.port";
import { CatchMindRepository } from "../presenters/catchMind.repository";
import { CatchMindToRoomPresenter } from "../presenters/catchMindToRoom.presenter";
import { CatchMindToRoom } from "./catchMindToRoom.port";
import { TimerRepository, Timer } from "../../../utils/timer";
import { TimerRepositoryDataPort } from "./timer.repository.port";

const MSEC_PER_SEC = 1000;

export class CatchMindService implements CatchMindInputPort {
  eventEmitter: CatchMindEventPort = new CatchMindEventPresenter();
  gameRepository: CatchMindRepositoryDataPort = new CatchMindRepository();
  timerRepository: TimerRepositoryDataPort = new TimerRepository();
  roomAPI: CatchMindToRoom = new CatchMindToRoomPresenter();

  async gameStart(
    goalScore: number,
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) {
    const game = new CatchMind({
      goalScore,
      players: players.map((id) => new Player({ id })),
      roundTime,
      roomId,
      totalRound,
    });

    const { roundInfo } = game;
    this.eventEmitter.gameStart(game.roomId, {
      totalRound,
      roundInfo,
    });

    console.log("\x1b[32mstart CatchMind\x1b[37m", roomId);

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async drawStart(roomId: string, keyword: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game || !game.isTurnPlayer(playerId) || game.keyword) {
      this.gameRepository.release(roomId);
      return;
    }

    console.log("catch input keyword", roomId, keyword);

    game.keyword = keyword;
    this.eventEmitter.drawStart(game.roomId, game.turnPlayer);

    const timerId = setTimeout(async () => {
      const game = await this.gameRepository.findById(roomId);
      if (!game) {
        this.gameRepository.release(roomId);
        return;
      }

      await this.roundEnd(game, null);

      this.gameRepository.release(roomId);
    }, game.roundTime * MSEC_PER_SEC);

    const timer = new Timer(roomId, timerId);

    this.timerRepository.save(game.roomId, timer);
    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async roundEnd(game: CatchMind, winner: string | null) {
    console.log("\x1b[36mround End catch\x1b[37m", game.roomId, winner);
    if (winner) game.addScore(winner);

    this.eventEmitter.roundEnd(game.roomId, {
      isLastRound: game.isGameEnded,
      suggestedWord: game.keyword,
      playerScoreMap: game.scoreMap,
      roundWinner: winner,
    });

    game.clearKeyword();

    await this.gameRepository.save(game);
  }

  async checkAnswer(roomId: string, answer: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    if (game.isRightAnswer(answer, playerId)) {
      this.cancelTimer(roomId);
      await this.roundEnd(game, playerId);
    }
    this.gameRepository.release(roomId);
  }

  async roundReady(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
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
    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  roundStart(game: CatchMind) {
    game.nextTurn();
    this.eventEmitter.roundStart(game.roomId, game.roundInfo);
  }

  async exitGame(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    if (game.isTurnPlayer(playerId)) {
      await this.roundEnd(game, null);
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
      return;
    } else {
      await this.gameRepository.save(game);
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
