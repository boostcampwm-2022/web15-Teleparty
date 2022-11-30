import { CatchMind, Player } from "./catchMind";
import { CatchMindEventAdapter } from "../outbound/CatchMindEvent.Adapter";
import { CatchMindEventPort } from "../outbound/catchMindEvent.port";
import { CatchMindRepositoryDataPort } from "../outbound/catchMind.repository.port";
import { CatchMindInputPort } from "../inbound/CatchMindInput.port";
import { CatchMindRepository } from "../outbound/catchMind.repository";
import { CatchMindToRoomAdapter } from "../outbound/catchMindToRoom.adapter";
import { CatchMindToRoom } from "../outbound/catchMindToRoom.port";

export class CatchMindService implements CatchMindInputPort {
  eventEmitter: CatchMindEventPort = new CatchMindEventAdapter();
  repository: CatchMindRepositoryDataPort = new CatchMindRepository();
  roomAPI: CatchMindToRoom = new CatchMindToRoomAdapter();

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
    const playerScoreMap: { [K: string]: number } = {};
    game.players.forEach((player: Player) => {
      playerScoreMap[player.id] = player.score;
    });

    this.eventEmitter.roundEnd(game.roomId, {
      isLastRound: game.isGameEnded,
      suggestedWord: game.keyword,
      playerScoreMap: playerScoreMap,
      roundWinner: winner,
    });

    if (game.isGameEnded) {
      this.repository.delete(game.roomId);
      this.roomAPI.gameEnded(game.roomId);
    } else {
      this.repository.save(game);
    }
  }

  checkAnswer(id: string, answer: string, playerId: string) {
    const game = this.repository.findById(id);
    if (!game) return;

    if (game.isRightAnswer(answer, playerId)) {
      game.addScore(playerId);
      this.roundEnd(game, playerId);
      game.clearKeyword();
      clearTimeout(game.timerId);
      if (!game.isGameEnded) {
        this.repository.save(game);
      }
    }
  }

  roundReady(id: string, playerId: string) {
    const game = this.repository.findById(id);
    if (!game) return;

    const player = game.findPlayer(playerId);

    if (player && !player.isReady) {
      this.eventEmitter.roundReady(game.roomId, player);
      game.ready(playerId);
      this.repository.save(game);
    }

    if (game.isAllReady) {
      this.roundStart(game);
    }
  }

  roundStart(game: CatchMind) {
    game.nextTurn();
    this.eventEmitter.roundStart(game.roomId, game.roundInfo);
    this.repository.save(game);
  }
}
