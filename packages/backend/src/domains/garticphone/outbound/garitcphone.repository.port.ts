import { Garticphone } from "../entity/garticphone";

export interface GarticphoneRepositoryDataPort {
  save: (game: Garticphone) => void;
  findById: (roomId: string) => Garticphone | undefined;
  delete: (roomId: string) => void;
}
