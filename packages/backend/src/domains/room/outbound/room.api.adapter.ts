import { RoomApiPort } from "./room.port";
import { DomainConnecter } from "../../../utils/domainConnecter";
import { GAME_MODE } from "../entity/room.entity";

interface StartData {
  roomId: string;
  players: string[];
  totalRound: number;
  roundTime: number;
  goalScore: number;
}

const connecter = DomainConnecter.getInstance();

const gameModeStartMap = {
  CatchMind: (data: StartData) => connecter.call("catchMind/game-start", data),

  Garticphone: (data: StartData) =>
    connecter.call("garticphone/game-start", data),
};

const gameModeMap = {
  CatchMind: (roomId: string, playerId: string) =>
    connecter.call("catchMind/player-quit", {
      roomId,
      playerId,
    }),
  Garticphone: (roomId: string, playerId: string) =>
    connecter.call("garticphone/player-quit", {
      roomId,
      playerId,
    }),
};

export class RoomApiAdapter implements RoomApiPort {
  chatting(senderId: string, roomId: string, message: string) {
    connecter.call("chat/send", { message, senderId, roomId });
  }

  gameStart(
    roomId: string,
    gameMode: GAME_MODE,
    players: string[],
    totalRound: number,
    roundTime: number,
    goalScore: number
  ) {
    // game controller gameStart 보냄

    // if or switch로 거르기 -> game Mode;

    if (!gameMode) return;

    gameModeStartMap[gameMode]({
      roomId,
      players,
      totalRound,
      roundTime,
      goalScore,
    });

    return;
  }

  playerQuit(gameMode: GAME_MODE, roomId: string, playerId: string) {
    // 여기서 게임 모드로 분기
    if (!gameMode) return;

    gameModeMap[gameMode](roomId, playerId);
  }

  getAllPlayer() {
    return connecter.call("player/get-all-players");
  }
}
