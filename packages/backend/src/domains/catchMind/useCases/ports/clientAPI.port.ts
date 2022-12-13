import {
  CatchMindInfo,
  RoundEndData,
  StartGameData,
} from "../../../../types/catchMind.type";
import { Player } from "../../entity/player";

export interface ClientAPIPort {
  gameStart: (roomId: string, data: StartGameData) => void;
  drawStart: (roomId: string, player: Player) => void;
  roundEnd: (roomId: string, data: RoundEndData) => void;
  roundReady: (roomId: string, player: Player) => void;
  roundStart: (roomId: string, data: CatchMindInfo) => void;
  playerExit: (roomId: string, playerId: string) => void;
}
