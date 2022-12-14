import { RoomService } from "../useCases/room.service";
import { RoomPort } from "./room.port";
import { DomainConnecter } from "../../../utils/domainConnecter";
import express, { Router } from "express";



const router: Router = express.Router();
const roomService: RoomPort = new RoomService();

router.post("/join", async (req, res) => {
  const { playerId, userName, avata, roomId } = req.body;
  if (roomService.checkPlayer(playerId)) {
    return;
  }

  const player = await roomService.createPlayer({
    peerId: playerId,
    userName,
    avata,
    roomId,
  });

  if (!player) {
    // 플레이어 생성 실패
    return;
  }

  // console.log("새로운 플레이어", player);

  // socket.join(player.roomId); // 소캣 방에 넣기

  roomService.join(player);
  res.sendStatus(200);
});

router.delete("/disconnect", (req, res) => {
  const { playerId } = req.body;

  console.log("disconnect", playerId);
  roomService.leave(playerId);
  res.sendStatus(200);
});

router.post("/game-start", (req, res) => {
  const { playerId, gameMode } = req.body;
  if (!["CatchMind", "Garticphone"].includes(gameMode)) {
    return;
  }
  // console.log("start-game");
  roomService.gameStart(playerId, gameMode);
  res.sendStatus(200);
});

router.patch("/mode-change", (req, res) => {
  const { playerId, gameMode } = req.body;
  if (!["CatchMind", "Garticphone"].includes(gameMode)) {
    return;
  }
  roomService.chooseMode(playerId, gameMode);
  res.sendStatus(200);
});

router.post("/chatting", (req, res) => {
  const { playerId, message } = req.body;
  roomService.chatting(playerId, message);
  res.sendStatus(200);
});

export { router as roomRouter };

const connecter = DomainConnecter.getInstance();

connecter.register("room/game-end", ({ roomId }: { roomId: string }) => {
  roomService.endGame(roomId);
});
