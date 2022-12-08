import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router";

import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  LobbyButtonBox,
  LobbyContentBox,
  LobbyLayout,
  LobbyRightContentBox,
} from "./Lobby.styles";

import Chat from "../../components/Chat/Chat.component";
import { Button } from "../../components/common/Button";
import GameModeSegmentedControl from "../../components/GameModeSegmentedControl/GameModeSegmentedControl.component";
import { Logo } from "../../components/Logo/Logo.component";
import PlayerList from "../../components/PlayerList/PlayerList.component";
import { GameMode, GAME_MODE_LIST } from "../../constants/game-mode";
import { gameInfoAtom } from "../../store/game";
import { playersAtom } from "../../store/players";
import { ratioAtom } from "../../store/ratio";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

import type { GameInfo, Player } from "../../types/game";

const Lobby = () => {
  const roomId = useAtomValue(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const setGameInfo = useSetAtom(gameInfoAtom);
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>(GAME_MODE_LIST[0]);
  const ratio = useAtomValue(ratioAtom);

  const onInviteClick = () => {
    toast.dismiss();
    const inviteUrl = `${window.location.origin}/?invite=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success("초대 링크가 복사되었습니다.");
  };

  const isHost =
    socket.id && players.find(({ isHost }) => isHost)?.peerId === socket.id;

  const onGameStartClick = () => {
    if (!isHost) return;
    if (players.some((player) => player.isGameQuit)) {
      toast.dismiss();
      toast.error("모든 플레이어가 방에 입장해야 합니다!");
    }
    socket.emit("game-start", { gameMode });
  };

  useEffect(() => {
    const gameStartListener = (gameStartResponse: GameInfo) => {
      setGameInfo(gameStartResponse);
      navigate("/room/game", { replace: true });
    };
    socket.on("game-start", gameStartListener);
    return () => {
      socket.off("game-start", gameStartListener);
    };
  }, [socket, navigate, setGameInfo]);

  useEffect(() => {
    const newJoinListener = (player: Player) => {
      setPlayers((prev) => [
        ...prev,
        { ...player, isMicOn: true, isAudioDetected: false },
      ]);
    };
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

        newPlayerList[quitGamePlayerIndex].isGameQuit = false;
        delete newPlayerList[quitGamePlayerIndex].isCurrentTurn;
        delete newPlayerList[quitGamePlayerIndex].isReady;
        return newPlayerList;
      });
    };
    socket.on("new-join", newJoinListener);
    socket.on("player-quit", playerQuitListener);
    socket.on("quit-game", quitGameListener);
    return () => {
      socket.off("new-join", newJoinListener);
      socket.off("player-quit", playerQuitListener);
      socket.off("quit-game", quitGameListener);
    };
  }, [socket, setPlayers]);

  useEffect(() => {
    setPlayers((prev) =>
      prev.map((player) => {
        delete player.isReady;
        delete player.isCurrentTurn;
        delete player.score;
        if (player.isGameQuit !== undefined) {
          player.isGameQuit = !player.isGameQuit;
        }
        return player;
      })
    );
  }, [setPlayers]);

  return roomId === undefined ? (
    <Navigate to="/" replace />
  ) : (
    <>
      <Toaster />
      <LobbyLayout ratio={ratio}>
        <div>
          <Logo height={100} />
        </div>
        <LobbyContentBox>
          <PlayerList maxPlayer={10} sizeType="large" />
          <LobbyRightContentBox>
            <GameModeSegmentedControl
              selectedGameMode={gameMode}
              setSelectedGameMode={setGameMode}
              disabled={!isHost}
            />
            <LobbyButtonBox>
              <Button variant="medium" onClick={onInviteClick}>
                초대
              </Button>
              <Button
                variant="medium"
                onClick={onGameStartClick}
                disabled={!isHost}
              >
                게임시작
              </Button>
            </LobbyButtonBox>
            <Chat variant="horizontal" />
          </LobbyRightContentBox>
        </LobbyContentBox>
      </LobbyLayout>
    </>
  );
};

export default Lobby;