import { SocketEmitter } from "../../../utils/socketEmitter";
import { ChatOutPort } from "./chatOut.port";

export class ChatOutAdapter implements ChatOutPort {
  emitter: SocketEmitter = new SocketEmitter();
  broadCast(roomId: string, data: { message: string; id: string }) {
    this.emitter.broadcastRoom(roomId, "chatting", data);
  }
}
