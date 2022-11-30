import { GarticphonePort } from "./garticphone.port";
import { GarticphoneService } from "../entity/garticphone.service";

import { SocketRouter } from "../../../utils/socketRouter";
import { DomainConnecter } from "../../../utils/domainConnecter";
import { Socket } from "socket.io";

const router = new SocketRouter();
const service: GarticphonePort = new GarticphoneService();
const connecter = DomainConnecter.getInstance();

router.get(
  "input-keyword",
  (socket: Socket, { keyword }: { keyword: string }) => {
    const room = connecter.call("room/get-by-playerId", { id: socket.id });

    if (room) service.setAlbumData(room.roomId, socket.id, keyword);
  }
);

router.get("keyword-cancel", (socket: Socket) => {
  const room = connecter.call("room/get-by-playerId", { id: socket.id });

  if (room) service.cancelAlbumData(room.roomId, socket.id);
});

connecter.register(
  "garticphone/game-start",
  ({
    roomId,
    roundTime,
    players,
  }: {
    roomId: string;
    roundTime: number;
    players: string[];
  }) => {
    service.startGame(roomId, roundTime, players);
  }
);

export const garticRouter = router.router;
