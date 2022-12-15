import { SocketRouter } from "../utils/socketRouter";
import { Socket } from "socket.io";
import axios from "axios";
import { ADDRESS } from "../config/config";

const router = new SocketRouter();
const garticAxios = axios.create({
  baseURL: ADDRESS.gartic,
  timeout: 3000,
});

router.get("input-keyword", async (socket: Socket, data) => {
  await garticAxios.post("/input-keyword", { playerId: socket.id, ...data });
});

router.get("keyword-cancel", async (socket: Socket) => {
  await garticAxios.patch("/keyword-cancel", { playerId: socket.id });
});

router.get("draw-input", async (socket: Socket, data) => {
  await garticAxios.post("/draw-input", { playerId: socket.id, ...data });
});

router.get("draw-cancel", async (socket: Socket) => {
  await garticAxios.patch("/draw-cancel", { playerId: socket.id });
});

router.get("request-album", async (socket: Socket) => {
  await garticAxios.post("/request-album", { playerId: socket.id });
});

router.get("quit-game", async (socket: Socket) => {
  await garticAxios.delete("/quit-game", { data: { playerId: socket.id } });
});

export const garticSocketRouter = router.router;
