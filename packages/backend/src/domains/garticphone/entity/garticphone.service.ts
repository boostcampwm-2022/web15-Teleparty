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

    this.repository.save(game);
    this.eventEmitter.gameStart(game.roomId, {
      gameMode: "Garticphone",
      totalRound: game.players.length,
      roundInfo: game.roundData,
    });
  }

  setAlbumData(roomId: string, playerId: string, data: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.setAlbumData(data, playerId);
    this.eventEmitter.keywordInput(roomId, playerId);

    // if (game.isAllInputed()) {
    //   // 다음 라운드
    // }
    this.repository.save(game);
  }

  cancelAlbumData(roomId: string, playerId: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.cancelAlbumData(playerId);
    this.eventEmitter.keywordCancel(roomId, playerId);

    this.repository.save(game);
  }
}
