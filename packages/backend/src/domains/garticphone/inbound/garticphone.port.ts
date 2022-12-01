export interface GarticphonePort {
  startGame: (roomId: string, roundTime: number, players: string[]) => void;
  setAlbumData: (roomId: string, playerId: string, data: string) => void;
  cancelAlbumData: (roomId: string, playerId: string) => void;
  sendAlbum: (roomId: string) => void;
  exitGame: (roomId: string, playerId: string) => void;
}
