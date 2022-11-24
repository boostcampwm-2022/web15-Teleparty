export interface ChatOutPort {
  broadcast: (roomId: string, data: { message: string; id: string }) => void;
}
