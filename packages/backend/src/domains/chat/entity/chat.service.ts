import { ChatOutAdapter } from "../outbound/chatOut.adapter";
import { ChatOutPort } from "../outbound/chatOut.port";

export class ChatService {
  out: ChatOutPort = new ChatOutAdapter();

  chatToRoom(chat: { message: string; id: string }, roomId: string) {
    this.out.broadcast(roomId, chat.id, chat);
  }
}
