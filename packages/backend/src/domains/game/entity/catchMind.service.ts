import { CatchMind, Player } from "./catchMind";
import { CatchMindEventAdapter } from "../outBound/CatchMindEvent.Adapter";
import { CatchMindEvent } from "../outBound/catchMindEvent.port";
import { CatchMindInputPort } from "../inBound/CatchMindInput.port";
import { CatchMindRepo } from "../outBound/catchMindRepository";

export class CatchMindService implements CatchMindInputPort {
  eventEmitter: CatchMindEvent = new CatchMindEventAdapter();
  repository: CatchMindRepo = new CatchMindRepo();

  gameStart(
    goalScore: number,
    players: Player[],
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

    this.repository.save(game);
  }

  drawStart(id: string, keyword: string) {
    const game = this.repository.findById(id);
    if (!game) return;

    game.keyword = keyword;
    this.eventEmitter.drawStart(game.roomId, game.turnPlayer);

    game.timerId = setTimeout(() => {
      this.roundEnd(game, null);
    }, game.roundTime);

    this.repository.save(game);
  }

  roundEnd(game: CatchMind, winner: string | null) {
    this.eventEmitter.roundEnd(game.roomId, {
      isLastRound: game.isGameEnded,
      playerScoreList: game.players,
      roundWinner: winner,
    });

    if (game.isGameEnded) {
      this.repository.delete(game);
    } else {
      this.repository.save(game);
    }
  }

  checkAnswer(id: string, answer: string, playerId: string) {
    const game = this.repository.findById(id);
    if (!game) return;

    if (game.isRightAnswer(answer)) {
      this.roundEnd(game, playerId);
      clearTimeout(game.timerId);
      this.repository.save(game);
    }
  }

  roundReady(id: string, playerId: string) {
    const game = this.repository.findById(id);
    if (!game) return;

    const player = game.findPlayer(playerId);

    if (player) this.eventEmitter.roundReady(game.roomId, player);
    game.ready(playerId);

    if (game.isAllReady) {
      this.roundStart(game);
    }

    this.repository.save(game);
  }

  roundStart(game: CatchMind) {
    game.nextTurn();
    this.eventEmitter.roundStart(game.roomId, game.roundInfo);
    this.repository.save(game);
  }
}
