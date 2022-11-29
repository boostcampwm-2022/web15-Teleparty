import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { MediaConnection } from "peerjs";

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
import { gameInfoAtom } from "../../store/game";
import { peerAtom } from "../../store/peer";
import { playersAtom } from "../../store/players";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

import type { GameInfo, Player } from "../../types/game";

const RoomPage = () => {
  const roomId = useAtomValue(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const peer = useAtomValue(peerAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const setGameInfo = useSetAtom(gameInfoAtom);
  const navigate = useNavigate();

  if (roomId === undefined) return <Navigate to="/" replace />;

  const onInviteClick = () => {
    const inviteUrl = `${window.location.origin}/?invite=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
  };

  const isHost =
    socket.id && players.find(({ isHost }) => isHost)?.peerId === socket.id;

  const onGameStartClick = () => {
    if (!isHost) return;
    socket.emit("game-start", { gameMode: "catchMind" });
  };

  useEffect(() => {
    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", preventClose);
    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  useEffect(() => {
    const gameStartListener = (gameStartResponse: GameInfo) => {
      setGameInfo(gameStartResponse);
      navigate("/game", { replace: true });
    };
    socket.on("game-start", gameStartListener);
    return () => {
      socket.off("game-start", gameStartListener);
    };
  }, []);

  useEffect(() => {
    const newJoinListener = (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    };
    socket.on("new-join", newJoinListener);
    return () => {
      socket.off("new-join", newJoinListener);
    };
  }, []);

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

  return (
    <RoomPageLayout>
      <Logo />
      <RoomPageContentBox>
        <PlayerList maxPlayer={10} players={players} sizeType="large" />
        <RoomPageRightContentBox>
          <GameModeSegmentedControl />
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
