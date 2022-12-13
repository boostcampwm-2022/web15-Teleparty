import { SocketEmitter } from "../utils/socketEmitter";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/game-start", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "game-start", data);
  res.sendStatus(200);
});

router.post("/input-keyword", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "input-keyword", data);
  res.sendStatus(200);
});

router.patch("/keyword-cancel", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "keyword-cancel", data);
  res.sendStatus(200);
});

router.post("/draw-input", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "draw-input", data);
  res.sendStatus(200);
});

router.patch("/draw-cancel", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "draw-cancel", data);
  res.sendStatus(200);
});

router.post("/time-out", (req, res) => {
  const { roomId } = req.body;
  SocketEmitter.broadcastRoom(roomId, "time-out");
  res.sendStatus(200);
});

router.post("/draw-start", (req, res) => {
  const { playerId, data } = req.body;
  SocketEmitter.emit(playerId, "draw-start", data);
  res.sendStatus(200);
});

router.post("/keyword-input-start", (req, res) => {
  const { playerId, data } = req.body;
  SocketEmitter.emit(playerId, "keyword-input-start", data);
  res.sendStatus(200);
});

router.post("/game-end", (req, res) => {
  const { roomId } = req.body;
  SocketEmitter.broadcastRoom(roomId, "game-end");
  res.sendStatus(200);
});

router.post("/album", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "album", data);
  res.sendStatus(200);
});

router.delete("/quit-game", (req, res) => {
  const { roomId, data } = req.body;
  SocketEmitter.broadcastRoom(roomId, "quit-game", data);
  res.sendStatus(200);
});

export { router as garticRouter };
