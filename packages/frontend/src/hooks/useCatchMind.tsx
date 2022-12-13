import { useState, useEffect } from "react";

import { useSetAtom } from "jotai";

import { playersAtom } from "../store/players";

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
  const setPlayers = useSetAtom(playersAtom);
  const [roundEndInfo, setRoundEndInfo] =
    useState<CatchMindRoundEndInfo | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(
    initialRoundInfo.turnPlayer === socket.id
  );

  useEffect(() => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        isReady: false,
        isCurrentTurn: player.peerId === initialRoundInfo.turnPlayer,
        score: 0,
        isGameQuit: false,
      }))
    );
  }, [setPlayers, initialRoundInfo]);

  // socket for game logic
  useEffect(() => {
    const roundStartListener = (roundInfo: CatchMindRoundInfo) => {
      const { turnPlayer } = roundInfo;
      setGameState("inputKeyword");
      setRoundInfo(roundInfo);
      setIsMyTurn(socket.id === roundInfo.turnPlayer);
      setPlayers((prev) =>
        prev.map((player) => ({
          ...player,
          isReady: false,
          isCurrentTurn: player.peerId === turnPlayer,
        }))
      );
    };
    const drawStartListener = () => {
      setGameState("drawing");
    };
    const roundEndListener = (roundEndInfo: CatchMindRoundEndInfo) => {
      const { playerScoreMap, isLastRound } = roundEndInfo;
      setGameState(isLastRound ? "gameEnd" : "roundEnd");
      setRoundEndInfo(roundEndInfo);
      setPlayers((prev) =>
        prev.map((player) => ({
          ...player,
          score: playerScoreMap[player.peerId],
        }))
      );
    };
    const roundReadyListener = ({ peerId }: { peerId: string }) => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const player = newPlayers.find((player) => player.peerId === peerId);
        if (!player) return prev;
        player.isReady = !player.isReady;
        return newPlayers;
      });
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
  }, [socket, setPlayers]);

  return {
    roundInfo,
    gameState,
    roundEndInfo,
    isMyTurn,
  };
};
