import { ChatService } from "../entity/chat.service";
import { DomainConnecter } from "../../../utils/domainConnecter";

// export class ChatInController {
//   chat: ChatService;

//   constructor() {
//     this.chat = new ChatService();
//   }

//   send(message: string, senderId: string, roomId: string) {
//     this.chat.chatToRoom({ message, id: senderId }, roomId);
//   }
// }

const connecter = DomainConnecter.getInstance();
const chatService = new ChatService();

connecter.register(
  "send-chat",
  (message: string, senderId: string, roomId: string) => {
    chatService.chatToRoom({ message, id: senderId }, roomId);
  }
);
