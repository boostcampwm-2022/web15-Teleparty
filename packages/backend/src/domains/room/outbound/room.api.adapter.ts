import { RoomApiPort } from "./room.port";
import { DomainConnecter } from "../../../utils/domainConnecter";

export class RoomApiAdapter implements RoomApiPort {
  connecter = DomainConnecter.getInstance();

  chatting(peerId: string, roomId: string, message: string) {
    this.connecter.call("chat/send", { message, peerId, roomId });
  }

  gameStart(
    roomId: string,
    gameMode: string,
    players: string[],
    totalRound: number,
    roundTime: number,
    goalScore: number
  ) {
    // game controller gameStart 보냄

    // if or switch로 거르기 -> game Mode;

    this.connecter.call("catchMind/game-start", {
      goalScore,
      players,
      roundTime,
      roomId,
      totalRound,
    });
    // console.log(roomId, gameMode, "gameStart");

    return;
  }

  getAllPlayer() {
    return this.connecter.call("player/get-all-players");
  }
}
