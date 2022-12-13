import { CatchMindControllerPort } from "../useCases/ports/CatchMind.controller.port";
import { CatchMindUseCase } from "../useCases/catchMind.useCase";
import { Socket } from "socket.io";
import { SocketRouter } from "../../../utils/socketRouter";

import { DomainConnecter } from "../../../utils/domainConnecter";

const gameService: CatchMindControllerPort = new CatchMindUseCase();
const router = new SocketRouter();
const connecter = DomainConnecter.getInstance();

const searchRoom = async (id: string) =>
  await connecter.call("room/get-by-playerId", { id });

router.get(
  "input-keyword",
  async (socket: Socket, { keyword }: { keyword: string }) => {
    const room = await searchRoom(socket.id);

    if (room) gameService.inputKeyword(room.roomId, keyword, socket.id);
  }
);

router.get(
  "chatting",
  async (socket: Socket, { message }: { message: string }) => {
    const room = await searchRoom(socket.id);

    if (room) gameService.checkAnswer(room.roomId, message, socket.id);
  }
);

router.get("round-ready", async (socket: Socket) => {
  const room = await searchRoom(socket.id);

  if (room) gameService.roundReady(room.roomId, socket.id);
});

router.get("quit-game", async (socket: Socket) => {
  const room = await searchRoom(socket.id);

  if (room) gameService.exitGame(room.roomId, socket.id);
});

export const catchMindRouter = router.router;
