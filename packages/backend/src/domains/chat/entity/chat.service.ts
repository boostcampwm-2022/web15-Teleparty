import { SocketEmitter } from "../../../utils/socketEmitter";

export class ChatService {
  emitter: SocketEmitter;
  constructor() {
    this.emitter = new SocketEmitter();
  }
  chatToRoom(chat: { message: string; id: string }, roomId: string) {
    this.emitter.broadcastRoom(roomId, "chatting", chat);
  }
}
