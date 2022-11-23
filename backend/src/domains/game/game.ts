import { Player } from "../player/player";

export interface Game {
  setSocketListner: (players: Player[]) => void;
}
