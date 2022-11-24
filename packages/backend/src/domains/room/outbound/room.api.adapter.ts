import { RoomApiPort } from "./room.port";
import { ChatInController } from "../../chat/inbound/chatIn.controller";
import { PlayerController } from "../../player/inbound/player.controller";
import { gameStart } from "../../game/inBound/catchMindInput.controller";

export class RoomApiAdapter implements RoomApiPort {
  chatController: ChatInController = new ChatInController();

  playerController: PlayerController = new PlayerController();

  chatting(peerId: string, roomId: string, message: string) {
    this.chatController.send(message, peerId, roomId);
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

    gameStart(goalScore, players, roundTime, roomId, totalRound);

    console.log(roomId, gameMode, "gameStart");

    return;
  }

  getAllPlayer() {
    return this.playerController.getAllPlayer();
  }
}
