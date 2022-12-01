import { SocketEmitter } from "../../../utils/socketEmitter";

import {
  GarticphoneEventPort,
  GarticStartData,
  GarticAlbum,
  GarticRoundData,
} from "./garticphoneEvent.port";

const EVENT_NAME = { painting: "draw-start", keyword: "keyword-input-start" };

export class GarticphoneEventAdapter implements GarticphoneEventPort {
  emitter: SocketEmitter = new SocketEmitter();

  gameStart(roomId: string, data: GarticStartData) {
    this.emitter.broadcastRoom(roomId, "game-start", data);
  }

  keywordInput(roomId: string, playerId: string) {
    this.emitter.broadcastRoom(roomId, "input-keyword", { peerId: playerId });
  }

  keywordCancel(roomId: string, playerId: string) {
    this.emitter.broadcastRoom(roomId, "keyword-cancel", { peerId: playerId });
  }

  timeOut(roomId: string) {
    this.emitter.broadcastRoom(roomId, "time-out");
  }

  roundstart(
    playerId: string,
    roundType: "painting" | "keyword",
    data: GarticRoundData
  ) {
    this.emitter.emit(playerId, EVENT_NAME[roundType], data);
  }

  gameEnd(roomId: string) {
    this.emitter.broadcastRoom(roomId, "game-end");
  }

  sendAlbum(roomId: string, data: GarticAlbum) {
    this.emitter.broadcastRoom(roomId, "album", data);
  }

  playerExit(roomId: string, playerId: string) {
    this.emitter.broadcastRoom(roomId, "quit-game", { peerId: playerId });
  }
}
