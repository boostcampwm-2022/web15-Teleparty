import { useState, useEffect } from "react";

import { Socket } from "socket.io-client";

import {
  Player,
  GamePlayer,
  CatchMineRoundInfo,
  CatchMindRoundEndInfo,
} from "../types/game";

type GameState = "inputKeyword" | "drawing" | "roundEnd" | "gameEnd";

// socket, player, first round info
export const useCatchMind = (
  socket: Socket,
  playerList: Player[],
  initialRoundInfo: CatchMineRoundInfo
) => {
  const [roundInfo, setRoundInfo] =
    useState<CatchMineRoundInfo>(initialRoundInfo);
  const [gameState, setGameState] = useState<GameState>("inputKeyword");
  const [gamePlayerList, setGamePlayerList] = useState<GamePlayer[]>(
    playerList.map((player) => {
      return {
        ...player,
        isCurrentTurn: player.peerId === initialRoundInfo.turnPlayer,
        isReady: false,
        score: 0,
      } as GamePlayer;
    })
  );
  const [roundEndInfo, setRoundEndInfo] =
    useState<CatchMindRoundEndInfo | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(
    initialRoundInfo.turnPlayer === socket.id
  );

  const initSocket = () => {
    socket.on(
      "round-start",
      ({ roundInfo }: { roundInfo: CatchMineRoundInfo }) => {
        const { turnPlayer } = roundInfo;
        setGameState("inputKeyword");
        setRoundInfo(roundInfo);
        setIsMyTurn(socket.id === roundInfo.turnPlayer);
        setGamePlayerList(
          gamePlayerList.map((player) => {
            return {
              ...player,
              isCurrentTurn: player.peerId === turnPlayer,
            };
          })
        );
      }
    );

    socket.on("draw-start", () => {
      setGameState("drawing");
    });

    socket.on("round-end", (roundEndInfo: CatchMindRoundEndInfo) => {
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
    });

    socket.on("round-ready", ({ peerId }: { peerId: string }) => {
      setGamePlayerList(
        gamePlayerList.map((player) => {
          return {
            ...player,
            isReady: player.peerId === peerId,
          };
        })
      );
    });
  };

  useEffect(() => {
    initSocket();
  }, []);

  return { roundInfo, gameState, gamePlayerList, roundEndInfo, isMyTurn };
};
