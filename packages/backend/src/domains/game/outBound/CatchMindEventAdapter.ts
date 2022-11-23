import { Socket, Server } from "socket.io";
import { Player } from "../entity/game";
import {
  CatchMindEvent,
  CatchMindInfo,
  RoundEndData,
  StartGameData,
} from "./catchMindEvent.port";

import { SocketEmitter } from "../../../utils/socketEmitter";

export class CatchMindEventAdapter implements CatchMindEvent {
  roomId: string;
  emitter: SocketEmitter;
  constructor(roomId: string) {
    this.roomId = roomId;
    this.emitter = new SocketEmitter();
  }
  gameStart(data: StartGameData) {
    this.emitter.broadcastRoom(this.roomId, "game-start", data);
  }
  drawStart(id: string) {
    this.emitter.broadcastRoom(this.roomId, "draw-start", { id });
  }
  roundEnd(data: RoundEndData) {
    this.emitter.broadcastRoom(this.roomId, "round-end", data);
  }
  roundReady(id: string) {
    this.emitter.broadcastRoom(this.roomId, "round-ready", { id });
  }
  roundStart(data: CatchMindInfo) {
    this.emitter.broadcastRoom(this.roomId, "round-start", data);
  }
}
