import { SocketEmitter } from "../../../utils/socketEmitter";
import {
  GarticphoneEventPort,
  GarticStartData,
  GarticRoundInfo,
} from "./garticphoneEvent.port";

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

  drawStart(playerId: string, keyword: string, roundInfo: GarticRoundInfo) {
    this.emitter.emit(playerId, "draw-start", {
      keyword,
      roundInfo,
    });
  }

  keywordInputStart(playerId: string, img: string, roundInfo: GarticRoundInfo) {
    this.emitter.emit(playerId, "keyword-input-start", {
      img,
      roundInfo,
    });
  }
}
