import axios from "axios";

import { Socket } from "socket.io";
import { ADDRESS } from "../config/config";
import { SocketRouter } from "../utils/socketRouter";

const catchMindAxios = axios.create({
  baseURL: ADDRESS.catchMind,
  timeout: 3000,
});

const router = new SocketRouter();

router.get("input-keyword", async (socket: Socket, data) => {
  await catchMindAxios.post("/input-keyword", { playerId: socket.id, ...data });
});

router.get("chatting", async (socket: Socket, data) => {
  await catchMindAxios.post("/chatting", { playerId: socket.id, ...data });
});

router.get("round-ready", async (socket: Socket) => {
  await catchMindAxios.post("/round-ready", { playerId: socket.id });
});

router.get("quit-game", async (socket: Socket) => {
  await catchMindAxios.delete("/quit-game", { data: { playerId: socket.id } });
});

export const catchMindSocketRouter = router.router;
