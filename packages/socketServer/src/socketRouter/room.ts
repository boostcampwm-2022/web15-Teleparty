import { Socket } from "socket.io";
import axios from "axios";

import { SocketRouter } from "../utils/socketRouter";
import { ADDRESS } from "../config/config";

const router = new SocketRouter();
const roomAxios = axios.create({
  baseURL: ADDRESS.room,
  timeout: 3000,
});

router.get("join", async (socket: Socket, data) => {
  await roomAxios.post("/join", { playerId: socket.id, ...data });
});

router.get("disconnect", async (socket: Socket) => {
  await roomAxios.delete("/disconnect", { data: { playerId: socket.id } });
});

router.get("game-start", async (socket: Socket, data) => {
  await roomAxios.post("/game-start", { playerId: socket.id, ...data });
});

router.get("mode-change", async (socket: Socket, data) => {
  await roomAxios.patch("/mode-change", { playerId: socket.id, ...data });
});

router.get("chatting", async (socket: Socket, data) => {
  await roomAxios.post("/chatting", { playerId: socket.id, ...data });
});

export const RoomSocketRouter = router.router;
