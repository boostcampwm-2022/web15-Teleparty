import { SocketEmitter } from "../../../utils/socketEmitter";
import { ErrorMsg, PlayerEvent } from "./player.port";

export class PlayerEventAdapter implements PlayerEvent {
  emitter: SocketEmitter;

  constructor() {
    this.emitter = new SocketEmitter();
  }

  error(peerId: string, msg: ErrorMsg) {
    this.emitter.emit(peerId, "error", msg);
  }
}
