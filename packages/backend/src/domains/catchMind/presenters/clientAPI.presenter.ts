import { ClientAPIPort } from "../useCases/ports/clientAPI.port";

import { SocketEmitter } from "../../../utils/socketEmitter";
import { Player } from "../entity/player";
import {
  CatchMindInfo,
  RoundEndData,
  StartGameData,
} from "../../../types/catchMind.type";

export class ClientEventPresenter implements ClientAPIPort {
  emitter: SocketEmitter;
  constructor() {
    this.emitter = new SocketEmitter();
  }

  gameStart(roomId: string, { totalRound, roundInfo }: StartGameData) {
    this.emitter.broadcastRoom(roomId, "game-start", {
      gameMode: "CatchMind",
      totalRound,
      roundInfo,
    });
  }

  drawStart(roomId: string, { id }: Player) {
    this.emitter.broadcastRoom(roomId, "draw-start", { turnPlayer: id });
  }

  roundEnd(roomId: string, data: RoundEndData) {
    this.emitter.broadcastRoom(roomId, "round-end", data);
  }

  roundReady(roomId: string, { id }: Player) {
    this.emitter.broadcastRoom(roomId, "round-ready", { peerId: id });
  }

  roundStart(roomId: string, data: CatchMindInfo) {
    this.emitter.broadcastRoom(roomId, "round-start", data);
  }

  playerExit(roomId: string, playerId: string) {
    this.emitter.broadcastRoom(roomId, "quit-game", { peerId: playerId });
  }
}
