import { ChatService } from "../entity/chat.service";

export class ChatInController {
  chat: ChatService;

  constructor() {
    this.chat = new ChatService();
  }

  send(message: string, senderId: string, roomId: string) {
    this.chat.chatToRoom({ message, id: senderId }, roomId);
  }
}
