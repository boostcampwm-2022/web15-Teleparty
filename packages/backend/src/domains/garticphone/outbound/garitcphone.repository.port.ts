import { Garticphone } from "../entity/garticphone";

export interface GarticphoneRepositoryDataPort {
  save: (game: Garticphone) => void;
  findById: (roomId: string) => Promise<Garticphone | undefined>;
  delete: (roomId: string) => void;
  getLock: (roomId: string) => Promise<unknown> | undefined;
  release: (roomId: string) => void;
}
