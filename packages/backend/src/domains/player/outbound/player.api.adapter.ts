// import { RoomApiController } from "../../room/inbound/room.controller";
import { DomainConnecter } from "../../../utils/domainConnecter";

import { PlayerApiPort } from "./player.port";

export class PlayerApiAdapter implements PlayerApiPort {
  connecter = DomainConnecter.getInstance();

  joinPlayer(peerId: string, roomId: string) {
    this.connecter.call("room/join", {
      peerId,
      roomId,
    });
    return;
  }

  leavePlayer(peerId: string) {
    this.connecter.call("room/leave", { peerId });
    return;
  }
}
