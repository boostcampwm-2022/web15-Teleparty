import { Game } from "../entity/game";
import { GameRepository } from "./gameRepository.port";

export class CatchMindRepo implements GameRepository {
  games: Game[] = [];
  save(game: Game) {
    this.games.push(game);
  }
  findById(id: string) {
    return this.games.find((game) => game.roomId === id) || null;
  }
  delete(id: string) {
    this.games = this.games.filter((game) => game.roomId !== id);
  }
}
