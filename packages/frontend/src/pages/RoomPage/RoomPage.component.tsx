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

import type { GameInfo, Player } from "../../types/game";
import type { MediaConnection } from "peerjs";

const RoomPage = () => {
  const roomId = useAtomValue(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const peer = useAtomValue(peerAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  useAudioCommunication(
    peer,
    players.map(({ peerId }) => peerId).filter((id) => id !== socket.id)
  );
  const setGameInfo = useSetAtom(gameInfoAtom);
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>(GAME_MODE_LIST[0]);
  usePreventClose();

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

  // handling WebRTC connection
  const initMediaConnection = (mediaConnection: MediaConnection) => {
    // mediaConnection.on
    mediaConnection.on("stream", (stream) => {
      const audio = new Audio();
      audio.autoplay = true;
      audio.srcObject = stream;
    });

    mediaConnection.on("close", () => {
      console.log("call closed");
    });

    mediaConnection.on("error", (error) => {
      console.error(error);
    });
  };

  const initPeer = async () => {
    if (!peer) return;

    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    peer.on("call", (mediaConnection) => {
      mediaConnection.answer(audioStream);
      initMediaConnection(mediaConnection);
    });
  };

  const connectRtcToRoomPlayers = async () => {
    if (!peer) return;

    for (const { peerId } of players) {
      if (peerId === socket.id) continue;

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      const mediaConnection = peer.call(peerId, mediaStream);
      initMediaConnection(mediaConnection);
    }
  };

  useEffect(() => {
    if (!peer) return;
    initPeer();
    connectRtcToRoomPlayers();
  }, []);

  return roomId === undefined ? (
    <Navigate to="/" replace />
  ) : (
    <RoomPageLayout>
      <Logo />
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
