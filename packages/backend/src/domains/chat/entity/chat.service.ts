import { SocketEmitter } from "../../../utils/socketEmitter";

export class Chat {
  emitter: SocketEmitter;
  constructor() {
    this.emitter = new SocketEmitter();
  }
  chatToRoom(chat: { message: string; id: string }, roomId: string) {
    this.emitter.broadcastRoom(roomId, "chatting", chat);
  }
}
