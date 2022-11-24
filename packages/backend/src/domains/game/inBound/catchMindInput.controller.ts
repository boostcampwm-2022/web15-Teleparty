import { Player } from "../entity/catchMind";
import { CatchMindInputPort } from "./CatchMindInput.port";
import { CatchMindService } from "../entity/catchMind.service";
import { Socket } from "socket.io";
import { SocketRouter } from "../../../utils/socketMiddlware";
import { SearchRoomController } from "../../room/inbound/SearchRoom.api.controller";

const gameService: CatchMindInputPort = new CatchMindService();
const router = new SocketRouter();
const roomSearcher = new SearchRoomController();

router.get(
  "input-keyword",
  (socket: Socket, { keyword }: { keyword: string }) => {
    const room = roomSearcher.getRoomByPlayerId(socket.id);
    if (room) gameService.drawStart(room.roomId, keyword);
  }
);

router.get(
  "chatting",
  (
    socket: Socket,
    { answer, playerId }: { answer: string; playerId: string }
  ) => {
    const room = roomSearcher.getRoomByPlayerId(socket.id);
    if (room) gameService.checkAnswer(room.roomId, answer, playerId);
  }
);

router.get(
  "round-ready",
  (socket: Socket, { playerId }: { playerId: string }) => {
    const room = roomSearcher.getRoomByPlayerId(socket.id);
    if (room) gameService.roundReady(room.roomId, playerId);
  }
);

export const gameStart = (
  goalScore: number,
  players: string[],
  roundTime: number,
  roomId: string,
  totalRound: number
) => {
  const playerList = Array.from(players, (player: string): Player => {
    return { id: player, score: 0, isReady: false };
  });

  gameService.gameStart(goalScore, playerList, roundTime, roomId, totalRound);
};

export const catchMindRouter = router.router;
