import { CatchMind } from "../entity/catchMind";
import { CatchMindRepositoryDataPort } from "./catchMind.repository.port";

export class CatchMindRepository implements CatchMindRepositoryDataPort {
  static games: Map<string, CatchMind> = new Map();

  save(game: CatchMind) {
    CatchMindRepository.games.set(game.roomId, game);
  }
  findById(id: string) {
    return CatchMindRepository.games.get(id) || undefined;
  }
  delete(roomId: string) {
    CatchMindRepository.games.delete(roomId);
  }
}
