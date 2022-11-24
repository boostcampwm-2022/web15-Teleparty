import { atom } from "jotai";
import { io, Socket } from "socket.io-client";

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const serverUrl = isDev ? "http://localhost:8000" : "https://teleparty.tk";

const socket = io(serverUrl, {
  transports: ["websocket"],
});

export const socketAtom = atom<Socket>(socket);
