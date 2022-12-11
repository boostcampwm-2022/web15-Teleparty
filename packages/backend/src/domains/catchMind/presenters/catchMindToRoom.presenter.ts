import { CatchMindToRoom } from "../useCases/catchMindToRoom.port";
import { DomainConnecter } from "../../../utils/domainConnecter";

export class CatchMindToRoomPresenter implements CatchMindToRoom {
  connecter = DomainConnecter.getInstance();

  gameEnded(roomId: string) {
    this.connecter.call("room/game-end", { roomId });
  }
}
