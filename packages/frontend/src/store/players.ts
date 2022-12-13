import { atom } from "jotai";

import type { GamePlayer, Player } from "../types/game";

// atoms
export const playersAtom = atom<GamePlayer[]>([]);

export const playerIdsAtom = atom((get) =>
  get(playersAtom).map(({ peerId }) => peerId)
);

// utils
export const getPlayerNameById = (players: GamePlayer[], playerId: string) =>
  players.find(({ peerId }) => peerId === playerId)?.userName;

export const isPlayerHost = (players: GamePlayer[], playerId: string) =>
  players.find(({ isHost }) => isHost)?.peerId === playerId;

export const isPlayerReady = (players: GamePlayer[], playerId: string) =>
  players.find(({ peerId }) => peerId === playerId)?.isReady ?? false;

export const isAllPlayerQuitFromGame = (players: GamePlayer[]) =>
  players.every(({ isGameQuit }) => isGameQuit === undefined || isGameQuit);

// actions
export const addPlayerAtom = atom(null, (get, set, player: Player) => {
  set(playersAtom, [
    ...get(playersAtom),
    { ...player, isMicOn: true, isAudioDetected: false },
  ]);
});

export const removePlayerAtom = atom(null, (get, set, playerId: string) => {
  set(
    playersAtom,
    get(playersAtom).filter(({ peerId }) => peerId === playerId)
  );
});

export const updatePlayersWithPartialPlayerInfoAtom = atom(
  null,
  (get, set, partialPlayerInfo: Partial<GamePlayer>) => {
    set(
      playersAtom,
      get(playersAtom).map((player) => ({ ...player, ...partialPlayerInfo }))
    );
  }
);

export const updatePlayerWithPartialPlayerInfoAtom = atom(
  null,
  (
    get,
    set,
    {
      playerId,
      partialPlayerInfo,
    }: { playerId: string; partialPlayerInfo: Partial<GamePlayer> }
  ) => {
    set(
      playersAtom,
      get(playersAtom).map((player) =>
        player.peerId === playerId
          ? { ...player, ...partialPlayerInfo }
          : player
      )
    );
  }
);

export const quitPlayerFromGameAtom = atom(
  null,
  (get, set, playerId: string) => {
    set(
      playersAtom,
      get(playersAtom).map((player) =>
        player.peerId === playerId
          ? {
              ...player,
              isGameQuit: true,
              isCurrentTurn: undefined,
              isReady: undefined,
            }
          : player
      )
    );
  }
);

// 리팩토링 필요!
export const removePlayersGameData = atom(null, (get, set) => {
  set(
    playersAtom,
    get(playersAtom).map((player) => {
      delete player.isReady;
      delete player.isCurrentTurn;
      delete player.score;
      if (player.isGameQuit !== undefined) {
        player.isGameQuit = !player.isGameQuit;
      }
      return player;
    })
  );
});

export const setCurrentTurnPlayerReady = atom(null, (get, set) => {
  set(
    playersAtom,
    get(playersAtom).map((player) =>
      player.isCurrentTurn
        ? { ...player, isCurrentTurn: false, isReady: true }
        : player
    )
  );
});
