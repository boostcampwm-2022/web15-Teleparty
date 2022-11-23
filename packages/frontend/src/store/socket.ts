import { atom } from "jotai";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = `http://localhost:8000`;

const socket = io(SOCKET_URL, { transports: ["websocket"] });

export const socketAtom = atom<Socket>(socket);
