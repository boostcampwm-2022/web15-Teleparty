import { Game } from "../entity/game";

export interface GameRepository {
  save: (game: Game) => void;
  findById: (id: string) => Game | null;
  delete: (id: string) => void;
}
