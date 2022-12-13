import { RoomAPIPort } from "../useCases/ports/roomAPI.port";
import { DomainConnecter } from "../../../utils/domainConnecter";

export class RoomAPIPresenter implements RoomAPIPort {
  connecter = DomainConnecter.getInstance();

  gameEnded(roomId: string) {
    this.connecter.call("room/game-end", { roomId });
  }
}
