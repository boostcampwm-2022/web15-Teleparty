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

  gameStart(
    goalScore: number,
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) {
    const game = new CatchMind(
      goalScore,
      players,
      roundTime,
      roomId,
      totalRound
    );

    const { roundInfo } = game;
    this.eventEmitter.gameStart(game.roomId, {
      totalRound,
      roundInfo,
    });

    this.gameRepository.save(game);
  }

  drawStart(roomId: string, keyword: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    game.keyword = keyword;
    this.eventEmitter.drawStart(game.roomId, game.turnPlayer);

    const timerId = setTimeout(() => {
      this.roundEnd(game.roomId, null);
    }, game.roundTime * MSEC_PER_SEC);

    const timer = new Timer(roomId, timerId);

    this.timerRepository.save(game.roomId, timer);
    this.gameRepository.save(game);
  }

  roundEnd(roomId: string, winner: string | null) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    if (winner) game.addScore(winner);

    this.eventEmitter.roundEnd(game.roomId, {
      isLastRound: game.isGameEnded,
      suggestedWord: game.keyword,
      playerScoreMap: game.scoreMap,
      roundWinner: winner,
    });

    game.clearKeyword();

    if (game.isGameEnded) {
      this.roomAPI.gameEnded(game.roomId);
    } else {
      this.gameRepository.save(game);
    }
  }

  checkAnswer(roomId: string, answer: string, playerId: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    if (game.isRightAnswer(answer, playerId)) {
      this.cancelTimer(roomId);
      this.roundEnd(roomId, playerId);
    }
  }

  roundReady(roomId: string, playerId: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    const player = game.findPlayer(playerId);

    if (player && !player.isReady) {
      this.eventEmitter.roundReady(game.roomId, player);
      game.ready(playerId);
      this.gameRepository.save(game);
    }

    if (game.isAllReady) {
      this.roundStart(game);
    }
  }

  roundStart(game: CatchMind) {
    game.nextTurn();
    this.eventEmitter.roundStart(game.roomId, game.roundInfo);
    this.gameRepository.save(game);
  }

  exitGame(roomId: string, playerId: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    if (game.isTurnPlayer(playerId)) {
      this.roundEnd(roomId, null);
      this.cancelTimer(roomId);
    }

    const result = game.exitGame(playerId);

    if (result) {
      this.eventEmitter.playerExit(roomId, playerId);
    }

    if (game.isAllExit) {
      this.roomAPI.gameEnded(roomId);
      this.gameRepository.delete(roomId);
    } else {
      this.gameRepository.save(game);
    }
  }

  cancelTimer(roomId: string) {
    const timer = this.timerRepository.findById(roomId);
    if (!timer) return;

    clearTimeout(timer.timer);

    this.timerRepository.delete(roomId);
  }
}
