import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Peer from "peerjs";

import { LandingPageLayout } from "./LandingPage.styles";

import { Button } from "../../components/common/Button";
import { Logo } from "../../components/Logo/Logo.component";
import NicknameInput from "../../components/NicknameInput/NicknameInput.component";
import { nicknameAtom, nicknameErrorAtom } from "../../store/nickname";
import { peerAtom } from "../../store/peer";
import { playersAtom } from "../../store/players";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

import type { Player } from "../../types/game";

interface JoinResponse {
  roomId: string;
  players: Player[];
}

const LandingPage = () => {
  const navigate = useNavigate();
  const setRoomId = useSetAtom(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const nickname = useAtomValue(nicknameAtom);
  const nicknameError = useAtomValue(nicknameErrorAtom);
  const setPlayers = useSetAtom(playersAtom);
  const [peer, setPeer] = useAtom(peerAtom);

  const invite = new URLSearchParams(window.location.search).get("invite");

  const onEnterClick = () => {
    if (nickname === "" || nicknameError) return;
    setRoomId(invite);

    // avatar 추가 필요
    socket.emit("join", { userName: nickname, avatar: "", roomId: invite });
  };

  const runAfterSocketConnected = (callback: () => void) => {
    if (socket.connected) callback();
    else {
      socket.on("connect", () => {
        callback();
      });
    }
  };

  useEffect(() => {
    runAfterSocketConnected(() => {
      console.log("my id: ", socket.id);
      setPeer(
        new Peer(socket.id, {
          debug: 0,
        })
      );
    });

    const joinListener = (joinResponse: JoinResponse) => {
      const { roomId, players } = joinResponse;
      setRoomId(roomId);
      setPlayers((prev) => [...prev, ...players]);
      navigate(`/room`, { replace: true });
    };
    socket.on("join", joinListener);

    return () => {
      if (peer) {
        peer.destroy();
        setPeer(null);
      }

      socket.off("join", joinListener);
    };
  }, []);

  return (
    <LandingPageLayout>
      <Logo />
      <NicknameInput />
      <Button
        variant="medium"
        onClick={onEnterClick}
        disabled={nickname === "" || nicknameError}
      >
        입장
      </Button>
    </LandingPageLayout>
  );
};

export default LandingPage;
