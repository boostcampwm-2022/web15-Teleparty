import { CatchMind } from "../entity/catchMind";

export interface CatchMindRepositoryDataPort {
  save: (game: CatchMind) => void;
  findById: (id: string) => Promise<CatchMind | undefined>;
  delete: (id: string) => void;
}
