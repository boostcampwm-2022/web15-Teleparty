export interface ChatInController {
  chat: (message: string, senderId: string, roomId: string) => void;
}
