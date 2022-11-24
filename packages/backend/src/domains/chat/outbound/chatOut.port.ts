export interface ChatOutPort {
  broadCast: (roomId: string, data: { message: string; id: string }) => void;
}
