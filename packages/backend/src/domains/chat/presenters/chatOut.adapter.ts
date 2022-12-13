import { SocketEmitter } from "../../../utils/socketEmitter";
import { ChatOutPort } from "../useCases/chatOut.port";

export class ChatPresenter implements ChatOutPort {
  emitter: SocketEmitter = new SocketEmitter();
  broadcast(
    roomId: string,
    peerId: string,
    data: { message: string; id: string }
  ) {
    this.emitter.broadcastRoomNotMe(roomId, peerId, "chatting", data);
  }
}
