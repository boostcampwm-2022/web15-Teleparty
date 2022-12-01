export interface GarticRoundInfo {
  roundTime: number;
  currentRound: number;
}

export interface GarticStartData {
  gameMode: "Garticphone";
  totalRound: number;
  roundInfo: GarticRoundInfo;
}

export interface GarticAlbum {
  peerId: string;
  isLast: boolean;
  result: { peerId: string; keyword?: string | null; img?: string | null }[];
}

export interface GarticRoundData {
  keyword: string | null;
  img: string | null;
  roundInfo: GarticRoundInfo;
}

export interface GarticphoneEventPort {
  gameStart: (roomId: string, data: GarticStartData) => void;
  keywordInput: (roomId: string, playerId: string) => void;
  keywordCancel: (roomId: string, playerId: string) => void;
  drawInput: (roomId: string, playerId: string) => void;
  drawCancel: (roomId: string, playerId: string) => void;
  timeOut: (roomId: string) => void;

  roundstart: (
    playerId: string,
    roundType: "painting" | "keyword",
    data: GarticRoundData
  ) => void;
  gameEnd: (roomId: string) => void;
  sendAlbum: (roomId: string, data: GarticAlbum) => void;
  playerExit: (roomId: string, playerId: string) => void;
}
