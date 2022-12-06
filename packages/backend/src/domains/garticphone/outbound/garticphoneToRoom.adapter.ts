import { GarticphoneToRoom } from "./garticphoneToRoom.port";
import { DomainConnecter } from "../../../utils/domainConnecter";

export class GarticphoneToRoomAdapter implements GarticphoneToRoom {
  connecter = DomainConnecter.getInstance();

  gameEnded(roomId: string) {
    this.connecter.call("room/game-end", { roomId });
  }
}
