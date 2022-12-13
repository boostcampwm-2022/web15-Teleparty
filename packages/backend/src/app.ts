import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

import { Server } from "socket.io";

import { SocketEmitter } from "./utils/socketEmitter";
import { catchMindRouter } from "./domains/catchMind/controllers/catchMind.controller";
import { RoomController } from "./domains/room/controllers/room.controller";
import { garticRouter } from "./domains/garticphone/controllers/garticphone.controller";

import "./domains/chat/controllers/chatIn.controller";
import "./domains/catchMind/controllers/catchMindAPI.controller";
import "./domains/garticphone/controllers/roomAPI.controller";
import "./domains/room/controllers/room.controller";
import "./domains/room/controllers/SearchRoom.api.controller";
import { createAdapter } from "@socket.io/cluster-adapter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// morgan 로그 설정
app.use(morgan("dev"));

app.get("/*", (req: Request, res: Response) => {
  res.sendFile("index.html");
});

const logHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("[" + new Date() + "]\n" + err.stack);
  next(err);
};

const errorHandler = (err: Error, req: Request, res: Response) => {
  const error = { status: 500, message: "서버 내부 Error!!" };
  const { message, status } = Object.assign(error, { ...err });

  res.status(status).json({ ...{ status, message } });
};

// 에러 설정
app.use(logHandler);
app.use(errorHandler);

const server = app.listen("8000", () => {
  console.log(`
  #################################################
  🛡️  Server listening on port: 8000
  #################################################
`);
});

const io = new Server(server, { cors: { origin: "*" } });
SocketEmitter.setServer(io);

if (process.env.ENV_MODE === "pm2") {
  io.adapter(createAdapter());
}

io.on("connection", (socket) => {
  socket.join("hello");
});

io.use(catchMindRouter);
io.use(RoomController);
io.use(garticRouter);
