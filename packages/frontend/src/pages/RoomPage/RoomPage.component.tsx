import { useEffect } from "react";
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
import { useAudioCommunication } from "../../hooks/useAudioCommunication";
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
  useAudioCommunication(
    peer,
    players.map(({ peerId }) => peerId).filter((id) => id !== socket.id)
  );
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

  return (
    <RoomPageLayout>
      <Logo />
      <RoomPageContentBox>
        <PlayerList maxPlayer={10} sizeType="large" />
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
