import {
  GarticphonePort,
  RoundType,
} from "../useCases/ports/garticphoneController.port";
import { GarticphoneUseCase } from "../useCases/garticphone.useCase";

import { DomainConnecter } from "../../../utils/domainConnecter";
import express, { Router } from "express";

const router: Router = express.Router();
const service: GarticphonePort = new GarticphoneUseCase();
const connecter = DomainConnecter.getInstance();

const searchRoom = async (id: string) =>
  await connecter.call("room/get-by-playerId", { id });

const inputData = async (id: string, data: string, type: RoundType) => {
  const room = await searchRoom(id);
  if (room) service.setAlbumData(room.roomId, id, data, type);
};

const cancelInput = async (id: string) => {
  const room = await searchRoom(id);
  if (room) service.cancelAlbumData(room.roomId, id);
};

router.post("/input-keyword", (req, res) => {
  const { playerId, keyword } = req.body;
  inputData(playerId, keyword, "keyword");
  res.sendStatus(200);
});

router.patch("/keyword-cancel", (req, res) => {
  const { playerId } = req.body;
  cancelInput(playerId);
  res.sendStatus(200);
});

router.post("/draw-input", (req, res) => {
  const { playerId, img } = req.body;
  inputData(playerId, img, "painting");
  res.sendStatus(200);
});

router.patch("/draw-cancel", (req, res) => {
  const { playerId } = req.body;
  cancelInput(playerId);
  res.sendStatus(200);
});

router.post("/request-album", async (req, res) => {
  const { playerId } = req.body;
  const room = await searchRoom(playerId);

  if (room) service.sendAlbum(room.roomId, playerId);
  res.sendStatus(200);
});

router.delete("/quit-game", async (req, res) => {
  console.log("quit- palywe");
  const { playerId } = req.body;
  const room = await searchRoom(playerId);

  if (room) service.exitGame(room.roomId, playerId);
  res.sendStatus(200);
});

export { router as garticRouter };
