import { ChatService } from "../useCases/chat.service";
import { DomainConnecter } from "../../../utils/domainConnecter";

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
