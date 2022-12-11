import { CatchMind } from "../entity/catchMind";

export interface CatchMindRepositoryDataPort {
  save: (game: CatchMind) => Promise<string>;
  findById: (id: string) => Promise<CatchMind | undefined>;
  delete: (id: string) => void;
  release: (roomId: string) => void;
}
