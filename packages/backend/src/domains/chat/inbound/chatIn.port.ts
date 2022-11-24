export interface ChatInPort {
  chat: (message: string, senderId: string, roomId: string) => void;
}
