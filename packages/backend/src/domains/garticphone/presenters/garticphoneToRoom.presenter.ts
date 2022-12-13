import { GarticphoneToRoom } from "../useCases/garticphoneToRoom.port";
import { DomainConnecter } from "../../../utils/domainConnecter";

export class GarticphoneToRoomPresenter implements GarticphoneToRoom {
  connecter = DomainConnecter.getInstance();

  gameEnded(roomId: string) {
    this.connecter.call("room/game-end", { roomId });
  }
}
