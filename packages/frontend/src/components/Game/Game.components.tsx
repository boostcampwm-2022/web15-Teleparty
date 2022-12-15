import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
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
      setPlayers((prev) => prev.filter((player) => player.peerId !== peerId));
    };
    const quitGameListener = ({ peerId }: { peerId: string }) => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const quitGamePlayer = newPlayers.find(
          (player) => player.peerId === peerId
        );
        if (!quitGamePlayer) return prev;
        quitGamePlayer.isGameQuit = true;
        delete quitGamePlayer.isCurrentTurn;
        delete quitGamePlayer.isReady;
        return newPlayers;
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
    <>
      <Toaster />
      <GameLayout ratio={ratio}>
        {gameInfo.gameMode === "CatchMind" ? <CatchMind /> : <Gartic />}
      </GameLayout>
    </>
  );
};

export default Game;
