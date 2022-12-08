import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAtomValue, useSetAtom } from "jotai";

import CatchMind from "./CatchMind/CatchMind.component";
import { GameLayout } from "./Game.styles";
import Gartic from "./Gartic/Gartic.component";

import { gameInfoAtom } from "../../store/game";
import { playersAtom } from "../../store/players";
import { ratioAtom } from "../../store/ratio";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

const Game = () => {
  const gameInfo = useAtomValue(gameInfoAtom);
  const socket = useAtomValue(socketAtom);
  const setPlayers = useSetAtom(playersAtom);
  const roomId = useAtomValue(roomIdAtom);
  const ratio = useAtomValue(ratioAtom);

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
    <GameLayout ratio={ratio}>
      {gameInfo.gameMode === "CatchMind" ? <CatchMind /> : <Gartic />}
    </GameLayout>
  );
};

export default Game;
