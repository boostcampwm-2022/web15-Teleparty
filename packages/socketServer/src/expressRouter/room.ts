import { SocketEmitter } from "../utils/socketEmitter";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/join", (req, res) => {
  const { peerId, data } = req.body;
  SocketEmitter.emit(peerId, "join", data);
  SocketEmitter.join(peerId, data.roomId);
  res.sendStatus(200);
});

router.post("/new-join", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoomNotMe(roomId, data.peerId, "new-join", data);
  res.sendStatus(200);
});

router.patch("/mode-change", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "mode-change", data);
  res.sendStatus(200);
});

router.delete("/player-quit", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "player-quit", data);
  res.sendStatus(200);
});

router.post("/error", (req, res) => {
  const { peerId, data } = req.body;
  SocketEmitter.emit(peerId, "error", data);
  res.sendStatus(200);
});

router.post("/chatting", (req, res) => {
  const { roomId, peerId, data } = req.body;
  SocketEmitter.broadcastRoomNotMe(roomId, peerId, "chatting", data);
  res.sendStatus(200);
});

export { router as roomRouter };
