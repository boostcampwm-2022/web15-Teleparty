import { GarticphonePort } from "../inbound/garticphone.port";
import { GarticphoneRepository } from "../outbound/garticphone.repository";
import { GarticphoneRepositoryDataPort } from "../outbound/garitcphone.repository.port";
import { Garticphone } from "./garticphone";
import { GarticphoneEventPort } from "../outbound/garticphoneEvent.port";
import { GarticphoneEventAdapter } from "../outbound/garticphoneEvent.adapter";

export class GarticphoneService implements GarticphonePort {
  repository: GarticphoneRepositoryDataPort = new GarticphoneRepository();
  eventEmitter: GarticphoneEventPort = new GarticphoneEventAdapter();

  startGame(roomId: string, roundTime: number, players: string[]) {
    const game = new Garticphone(players, roundTime, roomId);

    this.eventEmitter.gameStart(game.roomId, {
      gameMode: "Garticphone",
      totalRound: game.players.length,
      roundInfo: game.roundData,
    });

    const timerId = setTimeout(() => this.timeOut(roomId), roundTime);

    game.setTimer(timerId);
    this.repository.save(game);
  }

  timeOut(roomId: string) {
    this.eventEmitter.timeOut(roomId);
  }

  setAlbumData(roomId: string, playerId: string, data: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.setAlbumData(data, playerId);
    this.eventEmitter.keywordInput(roomId, playerId);

    if (game.isAllInputed) {
      clearTimeout(game.timerId);

      if (game.isGameEnded) {
        return;
      } else {
        game.roundEnd();
        this.roundStart(game);
      }
    }

    this.repository.save(game);
  }

  roundStart(game: Garticphone) {
    const players = game.getPlayerList();
    const roundInfo = game.roundData;

    if (game.currentRoundType === "keyword") {
      players.forEach((player) => {
        const target = game.getAlbumOwner(player.id, game.currentRound);
        if (!target) return;

        const lastData = target.getLastAlbumData();
        this.eventEmitter.keywordInputStart(player.id, lastData, roundInfo);
      });
    } else {
      players.forEach((player) => {
        const target = game.getAlbumOwner(player.id, game.currentRound);
        if (!target) return;

        const lastData = target.getLastAlbumData();
        this.eventEmitter.drawStart(player.id, lastData, roundInfo);
      });
    }
  }

  cancelAlbumData(roomId: string, playerId: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.cancelAlbumData(playerId);
    this.eventEmitter.keywordCancel(roomId, playerId);

    this.repository.save(game);
  }
}
