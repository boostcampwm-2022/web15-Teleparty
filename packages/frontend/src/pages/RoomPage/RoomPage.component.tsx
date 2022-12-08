import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  RoomPageButtonBox,
  RoomPageContentBox,
  RoomPageLayout,
  RoomPageRightContentBox,
} from "./RoomPage.styles";

import Chat from "../../components/Chat/Chat.component";
import { Button } from "../../components/common/Button";
import GameModeSegmentedControl from "../../components/GameModeSegmentedControl/GameModeSegmentedControl.component";
import { Logo } from "../../components/Logo/Logo.component";
import PlayerList from "../../components/PlayerList/PlayerList.component";
import { GameMode, GAME_MODE_LIST } from "../../constants/game-mode";
import { useAudioCommunication } from "../../hooks/useAudioCommunication";
import usePreventClose from "../../hooks/usePreventClose";
import { gameInfoAtom } from "../../store/game";
import { peerAtom } from "../../store/peer";
import { playersAtom } from "../../store/players";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";
import { AudioDetectListener } from "../../utils/audioStreamManager";

import type { GameInfo, Player } from "../../types/game";

const RoomPage = () => {
  const roomId = useAtomValue(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const peer = useAtomValue(peerAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const setGameInfo = useSetAtom(gameInfoAtom);
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>(GAME_MODE_LIST[0]);
  usePreventClose();

  const changeAudioDetectionStateOfPlayer: AudioDetectListener = (
    id,
    isAudioDetected
  ) => {
    setPlayers((players) =>
      players.map((player) => ({
        ...player,
        isAudioDetected:
          player.peerId === id ? isAudioDetected : player.isAudioDetected,
      }))
    );
  };

  useAudioCommunication(
    peer!,
    players.map(({ peerId }) => peerId).filter((id) => id !== socket.id),
    changeAudioDetectionStateOfPlayer
  );

  const onInviteClick = () => {
    const inviteUrl = `${window.location.origin}/?invite=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
  };

  const isHost =
    socket.id && players.find(({ isHost }) => isHost)?.peerId === socket.id;

  const onGameStartClick = () => {
    if (!isHost) return;
    socket.emit("game-start", { gameMode });
  };

  useEffect(() => {
    const gameStartListener = (gameStartResponse: GameInfo) => {
      setGameInfo(gameStartResponse);
      navigate("/game", { replace: true });
    };
    socket.on("game-start", gameStartListener);
    return () => {
      socket.off("game-start", gameStartListener);
    };
  }, [socket, navigate, setGameInfo]);

  useEffect(() => {
    const newJoinListener = (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    };
    socket.on("new-join", newJoinListener);
    return () => {
      socket.off("new-join", newJoinListener);
    };
  }, [socket, setPlayers]);

  return roomId === undefined ? (
    <Navigate to="/" replace />
  ) : (
    <RoomPageLayout>
      <Logo height={100} />
      <RoomPageContentBox>
        <PlayerList maxPlayer={10} sizeType="large" />
        <RoomPageRightContentBox>
          <GameModeSegmentedControl
            selectedGameMode={gameMode}
            setSelectedGameMode={setGameMode}
          />
          <RoomPageButtonBox>
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
          </RoomPageButtonBox>
          <Chat variant="horizontal" />
        </RoomPageRightContentBox>
      </RoomPageContentBox>
    </RoomPageLayout>
  );
};

export default RoomPage;
