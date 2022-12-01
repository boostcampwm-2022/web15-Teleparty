import { GarticphonePort } from "./garticphone.port";
import { GarticphoneService } from "../entity/garticphone.service";

import { SocketRouter } from "../../../utils/socketRouter";
import { DomainConnecter } from "../../../utils/domainConnecter";
import { Socket } from "socket.io";

const router = new SocketRouter();
const service: GarticphonePort = new GarticphoneService();
const connecter = DomainConnecter.getInstance();

const searchRoom = (id: string) =>
  connecter.call("room/get-by-playerId", { id });
const inputData = (id: string, data: string) => {
  const room = searchRoom(id);
  if (room) service.setAlbumData(room.roomId, id, data);
};

const cancelInput = (id: string) => {
  const room = searchRoom(id);
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

router.get("request-album", (socket: Socket) => {
  const room = searchRoom(socket.id);
  if (room) service.sendAlbum(room.roomId);
});

router.get("quit-game", (socket: Socket) => {
  const room = searchRoom(socket.id);

  if (room) service.exitGame(room.roomId, socket.id);
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

connecter.register(
  "garticphone/player-quit",
  ({ roomId, playerId }: { roomId: string; playerId: string }) => {
    service.exitGame(roomId, playerId);
  }
);

export const garticRouter = router.router;
