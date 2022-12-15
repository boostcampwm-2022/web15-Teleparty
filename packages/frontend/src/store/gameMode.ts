import { atom } from "jotai";

import { GameMode, GAME_MODE_LIST } from "../constants/game-mode";

export const gameModeAtom = atom<GameMode>(GAME_MODE_LIST[0]);
