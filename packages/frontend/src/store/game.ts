import { atom } from "jotai";

import type { GameInfo } from "../types/game";

const initialGameInfo = {
  roundInfo: {
    roundTime: 0,
    currentRound: 0,
    turnPlayer: "",
  },
  gameMode: "",
  totalRound: 0,
};

export const gameInfoAtom = atom<GameInfo>(initialGameInfo);
