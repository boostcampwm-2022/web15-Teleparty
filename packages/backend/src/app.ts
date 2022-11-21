import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

import { Server } from "socket.io";

import { roomController } from "./domains/room/room.controller";

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
  ################################################
  🛡️  Server listening on port: 8000
  ################################################
`);
});

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", roomController);
