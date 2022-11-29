import { CatchMindToRoom } from "./catchMindToRoom.port";
import { DomainConnecter } from "../../../utils/domainConnecter";

export class CatchMindToRoomAdapter implements CatchMindToRoom {
  connecter = DomainConnecter.getInstance();

  gameEnded(roomId: string) {
    this.connecter.call("room/game-end", { roomId });
  }
}
