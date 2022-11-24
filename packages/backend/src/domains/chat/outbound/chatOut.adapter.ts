import { SocketEmitter } from "../../../utils/socketEmitter";
import { ChatOutPort } from "./chatOut.port";

export class ChatOutAdapter implements ChatOutPort {
  emitter: SocketEmitter = new SocketEmitter();
  broadcast(
    roomId: string,
    peerId: string,
    data: { message: string; id: string }
  ) {
    this.emitter.broadcastRoomNotMe(roomId, peerId, "chatting", data);
  }
}
