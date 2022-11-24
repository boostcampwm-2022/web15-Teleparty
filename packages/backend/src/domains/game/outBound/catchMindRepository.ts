import { CatchMind } from "../entity/catchMind";
import { CatchMindRepositoryDataPort } from "./catchMind.Ropository.port";

export class CatchMindRepository implements CatchMindRepositoryDataPort {
  games: CatchMind[] = [];

  save(game: CatchMind) {
    const isExist = (roomId: string) =>
      this.games.some((game) => game.roomId === roomId);

    if (!isExist(game.roomId)) this.games.push(game);
  }
  findById(id: string) {
    return this.games.find((game) => game.roomId === id) || undefined;
  }
  delete(roomId: string) {
    this.games = this.games.filter((game) => game.roomId !== roomId);
  }
}
