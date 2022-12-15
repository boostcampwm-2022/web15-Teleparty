import { CatchMindControllerPort } from "../useCases/ports/CatchMind.controller.port";
import { CatchMindUseCase } from "../useCases/catchMind.useCase";

import { DomainConnecter } from "../../../utils/domainConnecter";
import express, { Router } from "express";

const router: Router = express.Router();
const gameService: CatchMindControllerPort = new CatchMindUseCase();
const connecter = DomainConnecter.getInstance();

const searchRoom = async (id: string) =>
  await connecter.call("room/get-by-playerId", { id });

router.post("/input-keyword", async (req, res) => {
  const { playerId, keyword } = req.body;
  const room = await searchRoom(playerId);

  if (room) gameService.inputKeyword(room.roomId, keyword, playerId);
  res.sendStatus(200);
});

router.post("/chatting", async (req, res) => {
  const { playerId, message } = req.body;
  const room = await searchRoom(playerId);

  if (room) gameService.checkAnswer(room.roomId, message, playerId);
  res.sendStatus(200);
});

router.post("/round-ready", async (req, res) => {
  const { playerId } = req.body;
  const room = await searchRoom(playerId);

  if (room) gameService.roundReady(room.roomId, playerId);
  res.sendStatus(200);
});

router.delete("/quit-game", async (req, res) => {
  const { playerId } = req.body;
  const room = await searchRoom(playerId);

  if (room) gameService.exitGame(room.roomId, playerId);
  res.sendStatus(200);
});

export { router as catchMindRouter };
