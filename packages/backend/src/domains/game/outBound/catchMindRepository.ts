import { CatchMind } from "../entity/catchMind";

export class CatchMindRepo {
  games: CatchMind[] = [];

  save(game: CatchMind) {
    const isExist = (roomId: string) =>
      this.games.some((game) => game.roomId === roomId);

    if (!isExist(game.roomId)) this.games.push(game);
  }
  findById(id: string) {
    return this.games.find((game) => game.roomId === id) || null;
  }
  delete(target: CatchMind) {
    this.games = this.games.filter((game) => game.roomId !== target.roomId);
  }
}
