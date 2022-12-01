import { useState, useEffect } from "react";

import type {
  Player,
  GamePlayer,
  CatchMindRoundInfo,
  CatchMindRoundEndInfo,
} from "../types/game";
import type { Socket } from "socket.io-client";

type GameState = "inputKeyword" | "drawing" | "roundEnd" | "gameEnd";

// socket, player, first round info
export const useCatchMind = (
  socket: Socket,
  playerList: Player[],
  initialRoundInfo: CatchMindRoundInfo
) => {
  const [roundInfo, setRoundInfo] =
    useState<CatchMindRoundInfo>(initialRoundInfo);
  const [gameState, setGameState] = useState<GameState>("inputKeyword");
  const [gamePlayerList, setGamePlayerList] = useState<GamePlayer[]>(
    playerList.map((player) => ({
      ...player,
      isCurrentTurn: player.peerId === initialRoundInfo.turnPlayer,
      isReady: false,
      score: 0,
    }))
  );
  const [roundEndInfo, setRoundEndInfo] =
    useState<CatchMindRoundEndInfo | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(
    initialRoundInfo.turnPlayer === socket.id
  );

  useEffect(() => {
    const roundStartListener = (roundInfo: CatchMindRoundInfo) => {
      console.log("round start!!: ", roundInfo);
      const { turnPlayer } = roundInfo;
      setGameState("inputKeyword");
      setRoundInfo(roundInfo);
      setIsMyTurn(socket.id === roundInfo.turnPlayer);
      setGamePlayerList(
        gamePlayerList.map((player) => {
          return {
            ...player,
            isReady: false,
            isCurrentTurn: player.peerId === turnPlayer,
          };
        })
      );
    };
    const drawStartListener = () => {
      setGameState("drawing");
    };
    const roundEndListener = (roundEndInfo: CatchMindRoundEndInfo) => {
      const { playerScoreMap, isLastRound } = roundEndInfo;
      setGameState(isLastRound ? "gameEnd" : "roundEnd");
      setRoundEndInfo(roundEndInfo);
      setGamePlayerList(
        gamePlayerList.map((player) => {
          return {
            ...player,
            score: playerScoreMap[player.peerId],
          };
        })
      );
    };
    const roundReadyListener = ({ peerId }: { peerId: string }) => {
      const player = gamePlayerList.find((player) => player.peerId === peerId);
      if (!player) return;
      player.isReady = !player.isReady;
      setGamePlayerList([...gamePlayerList]);
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
  }, [gamePlayerList, socket]);

  return { roundInfo, gameState, gamePlayerList, roundEndInfo, isMyTurn };
};
