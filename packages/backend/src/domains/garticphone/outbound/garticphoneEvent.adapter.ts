import { SocketEmitter } from "../../../utils/socketEmitter";
import { GarticphoneEventPort, GarticStartData } from "./garticphoneEvent.port";

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
}
