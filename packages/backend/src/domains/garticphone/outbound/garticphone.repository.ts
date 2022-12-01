import { Garticphone } from "../entity/garticphone";
import { GarticphoneRepositoryDataPort } from "./garitcphone.repository.port";

export class GarticphoneRepository implements GarticphoneRepositoryDataPort {
  static games: Map<string, Garticphone> = new Map();

  save(game: Garticphone) {
    GarticphoneRepository.games.set(game.roomId, game);
  }
  findById(id: string) {
    return GarticphoneRepository.games.get(id) || undefined;
  }
  delete(roomId: string) {
    GarticphoneRepository.games.delete(roomId);
  }
}
