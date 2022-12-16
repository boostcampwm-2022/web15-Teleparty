import { useState, useEffect } from "react";

import { useSetAtom } from "jotai";

import {
  initCatchMindGamePlayersAtom,
  setPlayerCurrentTurnAtom,
  setPlayerReadyAtom,
  updatePlayersScoreAtom,
} from "../store/players";

import type { CatchMindRoundInfo, CatchMindRoundEndInfo } from "../types/game";
import type { Socket } from "socket.io-client";

type GameState = "inputKeyword" | "drawing" | "roundEnd" | "gameEnd";

// socket, player, first round info
export const useCatchMind = (
  socket: Socket,
  initialRoundInfo: CatchMindRoundInfo
) => {
  const [roundInfo, setRoundInfo] =
    useState<CatchMindRoundInfo>(initialRoundInfo);
  const [gameState, setGameState] = useState<GameState>("inputKeyword");
  const initCatchMindGamePlayers = useSetAtom(initCatchMindGamePlayersAtom);
  const setPlayerCurrentTurn = useSetAtom(setPlayerCurrentTurnAtom);
  const updatePlayersScore = useSetAtom(updatePlayersScoreAtom);
  const setPlayerReady = useSetAtom(setPlayerReadyAtom);
  const [roundEndInfo, setRoundEndInfo] =
    useState<CatchMindRoundEndInfo | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(
    initialRoundInfo.turnPlayer === socket.id
  );

  useEffect(() => {
    initCatchMindGamePlayers(initialRoundInfo.turnPlayer);
  }, [initCatchMindGamePlayers, initialRoundInfo]);

  // socket for game logic
  useEffect(() => {
    const roundStartListener = (roundInfo: CatchMindRoundInfo) => {
      const { turnPlayer } = roundInfo;
      setGameState("inputKeyword");
      setRoundInfo(roundInfo);
      setIsMyTurn(socket.id === roundInfo.turnPlayer);
      setPlayerCurrentTurn(turnPlayer);
    };
    const drawStartListener = () => {
      setGameState("drawing");
    };
    const roundEndListener = (roundEndInfo: CatchMindRoundEndInfo) => {
      const { playerScoreMap, isLastRound } = roundEndInfo;
      setGameState(isLastRound ? "gameEnd" : "roundEnd");
      setRoundEndInfo(roundEndInfo);
      updatePlayersScore(playerScoreMap);
    };
    const roundReadyListener = ({ peerId }: { peerId: string }) => {
      setPlayerReady({ playerId: peerId, isReady: true });
    };
    socket.on("round-start", roundStartListener);
    socket.on("draw-start", drawStartListener);
    socket.on("round-end", roundEndListener);
    socket.on("round-ready", roundReadyListener);
    return () => {
      socket.off("round-start", roundStartListener);
      socket.off("draw-start", drawStartListener);
      socket.off("round-end", roundEndListener);
      socket.off("round-ready", roundReadyListener);
    };
  }, [socket, setPlayerCurrentTurn, setPlayerReady, updatePlayersScore]);

  return {
    roundInfo,
    gameState,
    roundEndInfo,
    isMyTurn,
  };
};
