import { GarticphonePort } from "../inbound/garticphone.port";
import { GarticphoneRepository } from "../outbound/garticphone.repository";
import { GarticphoneRepositoryDataPort } from "../outbound/garitcphone.repository.port";
import { Garticphone } from "./garticphone";

export class GarticphoneService implements GarticphonePort {
  repository: GarticphoneRepositoryDataPort = new GarticphoneRepository();

  startGame(roomId: string, roundTime: number, players: string[]) {
    const game = new Garticphone(players, roundTime, roomId);

    this.repository.save(game);
  }

  setAlbumData(roomId: string, playerId: string, data: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.setAlbumData(data, playerId);
  }

  cancelAlbumData(roomId: string, playerId: string) {
    const game = this.repository.findById(roomId);
    if (!game) return;

    game.cancelAlbumData(playerId);
  }
}
