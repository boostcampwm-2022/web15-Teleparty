export interface GarticRoundInfo {
  roundTime: number;
  currentRound: number;
}

export interface GarticStartData {
  gameMode: "Garticphone";
  totalRound: number;
  roundInfo: GarticRoundInfo;
}

export interface GarticphoneEventPort {
  gameStart: (roomId: string, data: GarticStartData) => void;
  keywordInput: (roomId: string, playerId: string) => void;
  keywordCancel: (roomId: string, playerId: string) => void;
  timeOut: (roomId: string) => void;
  drawStart: (
    playerId: string,
    keyword: string,
    roundInfo: GarticRoundInfo
  ) => void;
  keywordInputStart: (
    playerId: string,
    img: string,
    roundInfo: GarticRoundInfo
  ) => void;
}
