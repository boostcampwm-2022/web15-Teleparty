import { ChatService } from "../useCases/chat.service";
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

type ChatData = {
  message: string;
  senderId: string;
  roomId: string;
};

const connecter = DomainConnecter.getInstance();
const chatService = new ChatService();

connecter.register("chat/send", ({ message, senderId, roomId }: ChatData) => {
  chatService.chatToRoom({ message, id: senderId }, roomId);
});
