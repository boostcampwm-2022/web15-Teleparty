import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAtomValue, useSetAtom } from "jotai";

import { GamePageLayout } from "./GamePage.styles";

import CatchMind from "../../components/CatchMind/CatchMind.component";
import Gartic from "../../components/Gartic/Gartic.component";
import usePreventClose from "../../hooks/usePreventClose";
import { gameInfoAtom } from "../../store/game";
import { playersAtom } from "../../store/players";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

const GamePage = () => {
  const gameInfo = useAtomValue(gameInfoAtom);
  const socket = useAtomValue(socketAtom);
  const setPlayers = useSetAtom(playersAtom);
  const roomId = useAtomValue(roomIdAtom);
  usePreventClose();

  useEffect(() => {
    const playerQuitListener = ({ peerId }: { peerId: string }) => {
      setPlayers((prev) => {
        const newPlayerList = [...prev];
        const quitPlayerIndex = newPlayerList.findIndex(
          (player) => player.peerId === peerId
        );
        if (quitPlayerIndex === -1) return prev;
        newPlayerList.splice(quitPlayerIndex, 1);
        return newPlayerList;
      });
    };
    const quitGameListener = ({ peerId }: { peerId: string }) => {
      setPlayers((prev) => {
        const newPlayerList = [...prev];
        const quitGamePlayerIndex = newPlayerList.findIndex(
          (player) => player.peerId === peerId
        );
        if (quitGamePlayerIndex === -1) return prev;

        newPlayerList[quitGamePlayerIndex].isGameQuit = true;
        delete newPlayerList[quitGamePlayerIndex].isCurrentTurn;
        delete newPlayerList[quitGamePlayerIndex].isReady;
        return newPlayerList;
      });
    };
    socket.on("player-quit", playerQuitListener);
    socket.on("quit-game", quitGameListener);
    return () => {
      socket.off("player-quit", playerQuitListener);
      socket.off("quit-game", quitGameListener);
    };
  }, [socket, setPlayers]);

  return roomId === undefined ? (
    <Navigate to="/" replace />
  ) : (
    <GamePageLayout>
      {gameInfo.gameMode === "CatchMind" ? <CatchMind /> : <Gartic />}
    </GamePageLayout>
  );
};

export default GamePage;
