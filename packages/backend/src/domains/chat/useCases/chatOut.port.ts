export interface ChatOutPort {
  broadcast: (
    roomId: string,
    peerId: string,
    data: { message: string; id: string }
  ) => void;
}
