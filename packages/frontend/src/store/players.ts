import { atom } from "jotai";

import type { GamePlayer } from "../types/game";

export const playersAtom = atom<GamePlayer[]>([]);
