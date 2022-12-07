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

  drawStart(id: string, keyword: string) {
    const game = this.gameRepository.findById(id);
    if (!game) return;

    game.keyword = keyword;
    this.eventEmitter.drawStart(game.roomId, game.turnPlayer);

    const timerId = setTimeout(() => {
      this.roundEnd(game.roomId, null);
    }, game.roundTime * MSEC_PER_SEC);

    const timer = new Timer(timerId);

    this.timerRepository.save(game.roomId, timer);
    this.gameRepository.save(game);
  }

  roundEnd(roomId: string, winner: string | null) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    this.eventEmitter.roundEnd(game.roomId, {
      isLastRound: game.isGameEnded,
      suggestedWord: game.keyword,
      playerScoreMap: game.scoreMap,
      roundWinner: winner,
    });

<<<<<<< HEAD
    if (!game.isGameEnded) {
      this.repository.save(game);
      // this.roomAPI.gameEnded(game.roomId);
=======
    if (game.isGameEnded) {
      this.roomAPI.gameEnded(game.roomId);
    } else {
      this.gameRepository.save(game);
>>>>>>> 9551607 (feat: 타이머 저장 로직 변경 및 리팩토링)
    }
  }

  checkAnswer(id: string, answer: string, playerId: string) {
    const game = this.gameRepository.findById(id);
    if (!game) return;

    if (game.isRightAnswer(answer, playerId)) {
      game.addScore(playerId);
      this.roundEnd(game, playerId);
      game.clearKeyword();
      clearTimeout(game.timerId);
      if (!game.isGameEnded) {
        this.gameRepository.save(game);
      }
    }
  }

  roundReady(id: string, playerId: string) {
    const game = this.gameRepository.findById(id);
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

    const result = game.exitGame(playerId);

    if (result) {
      this.eventEmitter.playerExit(game.roomId, playerId);
    }

    if (game.isAllExit) {
      this.roomAPI.gameEnded(game.roomId);
      this.gameRepository.delete(game.roomId);
    } else {
      this.gameRepository.save(game);
    }
  }
  quitDuringGame(roomId: string, playerId: string) {
    const game = this.gameRepository.findById(roomId);
    if (!game) return;

    if (game.turnPlayer.id === playerId) {
      clearTimeout(game.timerId);
      this.roundEnd(game, null);
    }
    game.removePlayer(playerId);

    this.gameRepository.save(game);
  }
}
