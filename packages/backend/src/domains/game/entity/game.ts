export interface Player {
  socketId: string;
  peerId: string;
  score: number;
}

export interface Game {
  players: Player[];
  roomId: string;
  gameMode: string;

  setSocketListner: (players: Player[]) => void;
}
