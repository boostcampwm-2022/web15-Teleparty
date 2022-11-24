import {
  CatchMindEvent,
  CatchMindInfo,
  RoundEndData,
  StartGameData,
} from "./catchMindEvent.port";

import { SocketEmitter } from "../../../utils/socketEmitter";
import { Player } from "../entity/catchMind";

export class CatchMindEventAdapter implements CatchMindEvent {
  emitter: SocketEmitter;
  constructor() {
    this.emitter = new SocketEmitter();
  }

  gameStart(roomId: string, { totalRound, roundInfo }: StartGameData) {
    this.emitter.broadcastRoom(roomId, "game-start", {
      gameMode: "catchMind",
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
}
