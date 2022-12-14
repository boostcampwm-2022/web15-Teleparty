import { ChatPresenter } from "../presenters/chatOut.adapter";
import { ChatOutPort } from "./chatOut.port";

export class ChatService {
  out: ChatOutPort = new ChatPresenter();

  chatToRoom(chat: { message: string; id: string }, roomId: string) {
    this.out.broadcast(roomId, chat.id, chat);
  }
}
