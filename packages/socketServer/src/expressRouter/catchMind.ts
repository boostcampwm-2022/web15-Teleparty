import { SocketEmitter } from "../utils/socketEmitter";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/game-start", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "game-start", data);
  res.sendStatus(200);
});

router.post("/draw-start", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "draw-start", data);
  res.sendStatus(200);
});

router.post("/round-end", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "round-end", data);
  res.sendStatus(200);
});

router.post("/round-ready", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "round-ready", data);
  res.sendStatus(200);
});

router.post("/round-start", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "round-start", data);
  res.sendStatus(200);
});

router.delete("/quit-game", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "quit-game", data);
  res.sendStatus(200);
});

export { router as CatchMindRouter };
