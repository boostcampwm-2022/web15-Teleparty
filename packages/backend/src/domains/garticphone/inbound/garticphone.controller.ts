import { GarticphonePort } from "./garticphone.port";
import { GarticphoneService } from "../entity/garticphone.service";

import { SocketRouter } from "../../../utils/socketRouter";
import { DomainConnecter } from "../../../utils/domainConnecter";
import { Socket } from "socket.io";

const router = new SocketRouter();
const service: GarticphonePort = new GarticphoneService();
const connecter = DomainConnecter.getInstance();

const inputData = (id: string, data: string) => {
  const room = connecter.call("room/get-by-playerId", { id });
  if (room) service.setAlbumData(room.roomId, id, data);
};

const cancelInput = (id: string) => {
  const room = connecter.call("room/get-by-playerId", { id });
  if (room) service.cancelAlbumData(room.roomId, id);
};

router.get(
  "input-keyword",
  (socket: Socket, { keyword }: { keyword: string }) => {
    inputData(socket.id, keyword);
  }
);

router.get("keyword-cancel", (socket: Socket) => {
  cancelInput(socket.id);
});

router.get("draw-input", (socket: Socket, { img }: { img: string }) => {
  inputData(socket.id, img);
});

router.get("keyword-cancel", (socket: Socket) => {
  cancelInput(socket.id);
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
