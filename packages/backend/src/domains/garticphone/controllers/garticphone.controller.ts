import {
  GarticphonePort,
  RoundType,
} from "../useCases/ports/garticphoneController.port";
import { GarticphoneUseCase } from "../useCases/garticphone.useCase";

import { SocketRouter } from "../../../utils/socketRouter";
import { DomainConnecter } from "../../../utils/domainConnecter";
import { Socket } from "socket.io";

const router = new SocketRouter();
const service: GarticphonePort = new GarticphoneUseCase();
const connecter = DomainConnecter.getInstance();

const searchRoom = async (id: string) =>
  await connecter.call("room/get-by-playerId", { id });

const inputData = async (id: string, data: string, type: RoundType) => {
  const room = await searchRoom(id);
  if (room) service.setAlbumData(room.roomId, id, data, type);
};

const cancelInput = async (id: string) => {
  const room = await searchRoom(id);
  if (room) service.cancelAlbumData(room.roomId, id);
};

router.get(
  "input-keyword",
  (socket: Socket, { keyword }: { keyword: string }) => {
    inputData(socket.id, keyword, "keyword");
  }
);

router.get("keyword-cancel", (socket: Socket) => {
  cancelInput(socket.id);
});

router.get("draw-input", (socket: Socket, { img }: { img: string }) => {
  inputData(socket.id, img, "painting");
});

router.get("draw-cancel", (socket: Socket) => {
  cancelInput(socket.id);
});

router.get("request-album", async (socket: Socket) => {
  const room = await searchRoom(socket.id);
  console.log("request");
  if (room) service.sendAlbum(room.roomId, socket.id);
});

router.get("quit-game", async (socket: Socket) => {
  const room = await searchRoom(socket.id);

  if (room) service.exitGame(room.roomId, socket.id);
});

export const garticRouter = router.router;
