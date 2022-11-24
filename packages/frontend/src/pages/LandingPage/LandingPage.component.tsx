import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useAtom, useAtomValue } from "jotai";

import { LandingPageLayout } from "./LandingPage.styles";

import { Button } from "../../components/common/Button";
import { Logo } from "../../components/Logo/Logo.component";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

const LandingPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useAtom(roomIdAtom);
  const socket = useAtomValue(socketAtom);

  const invite = new URLSearchParams(window.location.search).get("invite");

  const onEnterClick = () => {
    setRoomId(invite);
    if (roomId === undefined) return;

    // userName, avatar 추가 필요
    socket.emit("join", { userName: "", avatar: "", roomId });
  };

  useEffect(() => {
    /**
     * @param data 임시로 any 사용
     */
    const joinListener = (data: any) => {
      const { roomId, players } = data;
      setRoomId(roomId);

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
      <Button variant="medium" onClick={onEnterClick}>
        입장
      </Button>
    </LandingPageLayout>
  );
};

export default LandingPage;
