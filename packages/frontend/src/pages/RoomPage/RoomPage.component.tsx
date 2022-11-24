import { useEffect } from "react";
import { Navigate } from "react-router";

import { useAtomValue } from "jotai";

import {
  RoomPageButtonBox,
  RoomPageContentBox,
  RoomPageLayout,
  RoomPageRightContentBox,
} from "./RoomPage.styles";

import { Button } from "../../components/common/Button";
import { Logo } from "../../components/Logo/Logo.component";
import PlayerList from "../../components/PlayerList/PlayerList.component";
import { playersAtom } from "../../store/players";
import { roomIdAtom } from "../../store/roomId";


const RoomPage = () => {
  const roomId = useAtomValue(roomIdAtom);
  const players = useAtomValue(playersAtom);

  if (roomId === undefined) return <Navigate to="/" replace />;

  const onInviteClick = () => {
    const inviteUrl = `${window.location.origin}/?invite=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
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

  return (
    <RoomPageLayout>
      <Logo />
      <RoomPageContentBox>
        <PlayerList maxPlayer={10} players={players} sizeType="large" />
        <RoomPageRightContentBox>
          {/* 게임 모드 선택 컴포넌트 */}
          <RoomPageButtonBox>
            <Button variant="medium" onClick={onInviteClick}>
              초대
            </Button>
          </RoomPageButtonBox>
          {/* 채팅 컴포넌트 */}
        </RoomPageRightContentBox>
      </RoomPageContentBox>
    </RoomPageLayout>
  );
};

export default RoomPage;
