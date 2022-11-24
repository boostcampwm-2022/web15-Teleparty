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
    this.emitter.broadcastRoom(roomId, "draw-start", { peerId: id });
  }

  roundEnd(roomId: string, data: RoundEndData) {
    const players = data.playerScoreList;

    this.emitter.broadcastRoom(roomId, "round-end", {
      ...data,
      playerScoreList: players.map(({ id, score }) => {
        return { peerId: id, score };
      }),
    });
  }

  roundReady(roomId: string, { id }: Player) {
    this.emitter.broadcastRoom(roomId, "round-ready", { peerId: id });
  }

  roundStart(roomId: string, data: CatchMindInfo) {
    this.emitter.broadcastRoom(roomId, "round-start", data);
  }
}
