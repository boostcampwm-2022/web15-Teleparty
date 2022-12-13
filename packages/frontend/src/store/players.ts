import { atom } from "jotai";

import type { GamePlayer } from "../types/game";

export const playersAtom = atom<GamePlayer[]>([]);

export const playerIdsAtom = atom((get) =>
  get(playersAtom).map(({ peerId }) => peerId)
);

export const getPlayerNameById = (players: GamePlayer[], playerId: string) =>
  players.find(({ peerId }) => peerId === playerId)?.userName;

export const isPlayerHost = (players: GamePlayer[], playerId: string) =>
  players.find(({ isHost }) => isHost)?.peerId === playerId;

export const isPlayerReady = (players: GamePlayer[], playerId: string) =>
  players.find(({ peerId }) => peerId === playerId)?.isReady ?? false;

export const isAllPlayerQuitFromGame = (players: GamePlayer[]) =>
  players.every(({ isGameQuit }) => isGameQuit);
