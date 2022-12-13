import { atom } from "jotai";

import type { GamePlayer } from "../types/game";

export const playersAtom = atom<GamePlayer[]>([]);

export const playerIdsAtom = atom((get) =>
  get(playersAtom).map(({ peerId }) => peerId)
);
