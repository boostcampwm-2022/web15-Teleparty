import { atom } from "jotai";

import type { Player } from "../types/game";

export const playersAtom = atom<Player[]>([]);
