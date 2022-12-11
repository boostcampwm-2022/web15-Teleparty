import { Garticphone } from "../entity/garticphone";

export interface GarticphoneRepositoryDataPort {
  save: (game: Garticphone) => Promise<unknown>;
  findById: (roomId: string) => Promise<Garticphone | undefined>;
  delete: (roomId: string) => void;
  // getLock: (roomId: string, playerId: string) => Promise<unknown> | undefined;
  release: (roomId: string) => void;
  // createLock: (roomId: string) => void;
}
