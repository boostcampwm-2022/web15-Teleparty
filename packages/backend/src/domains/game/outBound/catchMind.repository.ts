import { CatchMind } from "../entity/catchMind";
import { CatchMindRepositoryDataPort } from "./catchMind.repository.port";

export class CatchMindRepository implements CatchMindRepositoryDataPort {
  games: Map<string, CatchMind> = new Map();

  save(game: CatchMind) {
    this.games.set(game.roomId, game);
  }
  findById(id: string) {
    return this.games.get(id) || undefined;
  }
  delete(roomId: string) {
    this.games.delete(roomId);
  }
}
