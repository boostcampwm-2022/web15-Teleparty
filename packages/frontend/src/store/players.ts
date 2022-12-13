import { atom } from "jotai";

import type { GamePlayer, Player, PlayerScoreMap } from "../types/game";

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

// action helpers
const updatePlayersWithPartialPlayerInfoHelper = (
  players: GamePlayer[],
  partialPlayerInfo: Partial<GamePlayer>
) => players.map((player) => ({ ...player, ...partialPlayerInfo }));

const updatePlayerWithPartialPlayerInfoHelper = (
  players: GamePlayer[],
  playerId: string,
  partialPlayerInfo: Partial<GamePlayer>
) =>
  players.map((player) =>
    player.peerId === playerId
      ? { ...player, ...partialPlayerInfo }
      : { ...player }
  );

// actions
export const addPlayerAtom = atom(null, (get, set, player: Player) => {
  set(playersAtom, [
    ...get(playersAtom),
    { ...player, isMicOn: true, isAudioDetected: false },
  ]);
});

export const addPlayersAtom = atom(null, (get, set, players: Player[]) => {
  set(playersAtom, [
    ...get(playersAtom),
    ...players.map((player) => ({
      ...player,
      isMicOn: true,
      isAudioDetected: false,
    })),
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
      updatePlayersWithPartialPlayerInfoHelper(
        get(playersAtom),
        partialPlayerInfo
      )
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
      updatePlayerWithPartialPlayerInfoHelper(
        get(playersAtom),
        playerId,
        partialPlayerInfo
      )
    );
  }
);

export const quitPlayerFromGameAtom = atom(
  null,
  (get, set, playerId: string) => {
    set(
      playersAtom,
      updatePlayerWithPartialPlayerInfoHelper(get(playersAtom), playerId, {
        isGameQuit: true,
        isCurrentTurn: undefined,
        isReady: undefined,
      })
    );
  }
);

// 리팩토링 필요!
export const removePlayersGameDataAtom = atom(null, (get, set) => {
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

export const setCurrentTurnPlayerReadyAtom = atom(null, (get, set) => {
  set(
    playersAtom,
    get(playersAtom).map((player) =>
      player.isCurrentTurn
        ? { ...player, isCurrentTurn: false, isReady: true }
        : player
    )
  );
});

export const initCatchMindGamePlayersAtom = atom(
  null,
  (get, set, turnPlayerId: string) => {
    set(
      playersAtom,
      get(playersAtom).map((player) => ({
        ...player,
        isReady: false,
        isCurrentTurn: player.peerId === turnPlayerId,
        score: 0,
        isGameQuit: false,
      }))
    );
  }
);

export const initGarticGamePlayersAtom = atom(null, (get, set) => {
  set(
    playersAtom,
    updatePlayersWithPartialPlayerInfoHelper(get(playersAtom), {
      isReady: false,
      isCurrentTurn: false,
      isGameQuit: false,
    })
  );
});

export const setPlayerCurrentTurnAtom = atom(
  null,
  (get, set, turnPlayerId: string) => {
    set(
      playersAtom,
      get(playersAtom).map((player) => ({
        ...player,
        isReady: false,
        isCurrentTurn: player.peerId === turnPlayerId,
      }))
    );
  }
);

export const updatePlayersScoreAtom = atom(
  null,
  (get, set, playerScoreMap: PlayerScoreMap) => {
    set(
      playersAtom,
      get(playersAtom).map((player) => ({
        ...player,
        score: playerScoreMap[player.peerId],
      }))
    );
  }
);

export const setPlayerisAudioDetectedAtom = atom(
  null,
  (
    get,
    set,
    {
      playerId,
      isAudioDetected,
    }: { playerId: string; isAudioDetected: boolean }
  ) => {
    set(
      playersAtom,
      updatePlayerWithPartialPlayerInfoHelper(get(playersAtom), playerId, {
        isAudioDetected,
      })
    );
  }
);

export const setPlayersReadyAtom = atom(null, (get, set, isReady: boolean) => {
  set(
    playersAtom,
    updatePlayersWithPartialPlayerInfoHelper(get(playersAtom), {
      isReady,
    })
  );
});

export const setPlayerReadyAtom = atom(
  null,
  (get, set, { playerId, isReady }: { playerId: string; isReady: boolean }) => {
    set(
      playersAtom,
      updatePlayerWithPartialPlayerInfoHelper(get(playersAtom), playerId, {
        isReady,
      })
    );
  }
);

export const updatePlayersNextAlbumTurnAtom = atom(
  null,
  (get, set, playerId: string) => {
    const waitingPlayers = get(playersAtom).map((player) =>
      player.isCurrentTurn
        ? { ...player, isCurrentTurn: false, isReady: true }
        : player
    );

    set(
      playersAtom,
      updatePlayerWithPartialPlayerInfoHelper(waitingPlayers, playerId, {
        isCurrentTurn: true,
      })
    );
  }
);
