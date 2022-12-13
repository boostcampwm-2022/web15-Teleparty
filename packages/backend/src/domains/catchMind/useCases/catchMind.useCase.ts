import { CatchMind } from "../entity/catchMind";

import { ClientAPIPresenter } from "../presenters/clientAPI.presenter";
import { ClientAPIPort } from "./ports/clientAPI.port";
import { CatchMindRepositoryDataPort } from "./ports/catchMind.repository.port";
import { CatchMindControllerPort } from "./ports/CatchMind.controller.port";
import { CatchMindRepository } from "../presenters/catchMind.repository";
import { RoomAPIPresenter } from "../presenters/roomAPI.presenter";
import { RoomAPI } from "./ports/roomAPI.port";
import { TimerRepository, Timer } from "../../../utils/timer";
import { TimerRepositoryDataPort } from "./ports/timer.repository.port";
import { CatchMindFactory } from "../entity/catchMind.factory";
import { Chalk } from "../../../utils/chalk";

const MSEC_PER_SEC = 1000;

export class CatchMindUseCase implements CatchMindControllerPort {
  clientAPI: ClientAPIPort = new ClientAPIPresenter();
  gameRepository: CatchMindRepositoryDataPort = new CatchMindRepository();
  timerRepository: TimerRepositoryDataPort = new TimerRepository();
  roomAPI: RoomAPI = new RoomAPIPresenter();

  async gameStart(
    goalScore: number,
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) {
    const game = CatchMindFactory.creatCatchMind({
      goalScore,
      players,
      roundTime,
      roomId,
      totalRound,
    });

    this.clientAPI.gameStart(game.roomId, {
      totalRound: game.totalRound,
      roundInfo: game.roundInfo,
    });

    console.log(Chalk.fgGreen("start CatchMind"), roomId);

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async inputKeyword(roomId: string, keyword: string, playerId: string) {
    console.log("catch input keyword", roomId, keyword);
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    console.log("catch input keyword", roomId, keyword);

    const result = game.setKeyword(keyword, playerId);
    if (result) {
      this.clientAPI.drawStart(game.roomId, game.turnPlayer);
      this.setTimer(roomId, game);
      await this.gameRepository.save(game);
    }

    this.gameRepository.release(roomId);
  }

  setTimer(roomId: string, game: CatchMind) {
    const timerId = setTimeout(async () => {
      const game = await this.gameRepository.findById(roomId);
      if (!game) {
        this.gameRepository.release(roomId);
        return;
      }

      this.roundEnd(game, null);
      game.timeout();

      await this.gameRepository.save(game);
      this.gameRepository.release(roomId);
    }, game.roundTime * MSEC_PER_SEC);

    const timer = new Timer(roomId, timerId);
    this.timerRepository.save(game.roomId, timer);
  }

  roundEnd(game: CatchMind, winner: string | null) {
    console.log(Chalk.fgCyan("round End catch"), game.roomId, winner);

    this.clientAPI.roundEnd(game.roomId, {
      isLastRound: game.isGameEnded,
      suggestedWord: game.keyword,
      playerScoreMap: game.scoreMap,
      roundWinner: winner,
    });

    game.clearKeyword();
  }

  async checkAnswer(roomId: string, answer: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    const result = game.challengeAnswer(answer, playerId);
    if (result) {
      this.cancelTimer(roomId);
      this.roundEnd(game, playerId);
      await this.gameRepository.save(game);
    }

    this.gameRepository.release(roomId);
  }

  async roundReady(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    const result = game.ready(playerId);
    if (result) {
      this.clientAPI.roundReady(game.roomId, playerId);
    }

    if (game.isAllReady) {
      game.nextTurn();
      this.clientAPI.roundStart(game.roomId, game.roundInfo);
    }

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  async exitGame(roomId: string, playerId: string) {
    const game = await this.gameRepository.findById(roomId);
    if (!game) {
      this.gameRepository.release(roomId);
      return;
    }

    if (game.isTurnPlayer(playerId)) {
      this.roundEnd(game, null);
      this.cancelTimer(roomId);
    }

    if (game.exitGame(playerId)) {
      if (game.remainPlayerNum <= 1) {
        this.roundEnd(game, null);
        this.cancelTimer(roomId);
      }
      this.clientAPI.playerExit(roomId, playerId);
    }

    if (game.remainPlayerNum === 0) {
      console.log("\x1b[33mend game\x1b[37m", roomId);
      this.roomAPI.gameEnded(roomId);
      this.gameRepository.delete(roomId);
      return;
    }

    await this.gameRepository.save(game);
    this.gameRepository.release(roomId);
  }

  cancelTimer(roomId: string) {
    const timer = this.timerRepository.findById(roomId);
    if (!timer) return;

    clearTimeout(timer.timer);

    this.timerRepository.delete(roomId);
  }
}
