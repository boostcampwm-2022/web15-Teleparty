import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { LandingPageLayout } from "./LandingPage.styles";

import { Button } from "../../components/common/Button";
import { Logo } from "../../components/Logo/Logo.component";
import NicknameInput from "../../components/NicknameInput/NicknameInput.component";
import { nicknameAtom, nicknameErrorAtom } from "../../store/nickname";
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
  const [roomId, setRoomId] = useAtom(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const nickname = useAtomValue(nicknameAtom);
  const nicknameError = useAtomValue(nicknameErrorAtom);
  const setPlayers = useSetAtom(playersAtom);

  const invite = new URLSearchParams(window.location.search).get("invite");

  const onEnterClick = () => {
    if (nickname === "" || nicknameError) return;
    console.log("click");
    setRoomId(invite);
    if (roomId === undefined) return;

    // avatar 추가 필요
    socket.emit("join", { userName: nickname, avatar: "", roomId });
  };

  useEffect(() => {
    const joinListener = (joinResponse: JoinResponse) => {
      const { roomId, players } = joinResponse;
      setRoomId(roomId);
      setPlayers((prev) => [...prev, ...players]);
      navigate(`/room`, { replace: true });
    };
    socket.on("join", joinListener);
    return () => {
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
