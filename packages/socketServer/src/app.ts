import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

import { Server } from "socket.io";

import { SocketEmitter } from "./utils/socketEmitter";

import { createAdapter } from "@socket.io/cluster-adapter";

import { catchMindSocketRouter } from "./socketRouter/catchMind";
import { RoomSocketRouter } from "./socketRouter/room";
import { garticSocketRouter } from "./socketRouter/garticphone";

import { roomRouter } from "./expressRouter/room";
import { garticRouter } from "./expressRouter/gartic";
import { CatchMindRouter } from "./expressRouter/catchMind";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// morgan 로그 설정
app.use(morgan("dev"));

app.use("/room", roomRouter);
app.use("/gartic", garticRouter);
app.use("/catchMind", CatchMindRouter);

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

io.use(catchMindSocketRouter);
io.use(RoomSocketRouter);
io.use(garticSocketRouter);
