import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Peer from "peerjs";

import { LandingPageLayout } from "./LandingPage.styles";

import AvatarChanger from "../../components/AvatarChanger/AvatarChanger.component";
import { Button } from "../../components/common/Button";
import { Logo } from "../../components/Logo/Logo.component";
import NicknameInput from "../../components/NicknameInput/NicknameInput.component";
import { GameMode } from "../../constants/game-mode";
import { avatarUrlAtom } from "../../store/avatarUrl";
import { gameModeAtom } from "../../store/gameMode";
import { peerAtom } from "../../store/peer";
import { addPlayersAtom } from "../../store/players";
import { ratioAtom } from "../../store/ratio";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";
import { createPeerId } from "../../utils/peer";

import type { Player } from "../../types/game";

interface JoinResponse {
  roomId: string;
  players: Player[];
  gameMode: GameMode;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const setRoomId = useSetAtom(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const addPlayers = useSetAtom(addPlayersAtom);
  const setGameMode = useSetAtom(gameModeAtom);
  const [peer, setPeer] = useAtom(peerAtom);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const [nicknameError, setNicknameError] = useState(true);
  const ratio = useAtomValue(ratioAtom);
  const avatarUrl = useAtomValue(avatarUrlAtom);

  const invite = new URLSearchParams(window.location.search).get("invite");

  const onEnterClick = () => {
    if (!nicknameRef.current?.value || nicknameError) return;
    setRoomId(invite);

    // avatar 추가 필요
    socket.emit("join", {
      userName: nicknameRef.current.value,
      avatar: avatarUrl,
      roomId: invite,
    });
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
        new Peer(createPeerId(socket.id), {
          debug: 0,
        })
      );
    });

    const joinListener = (joinResponse: JoinResponse) => {
      const { roomId, players, gameMode } = joinResponse;
      setGameMode(gameMode);
      setRoomId(roomId);
      addPlayers(players);
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

  useEffect(() => {
    const errorListener = ({ message }: { message: string }) => {
      toast.dismiss();
      toast.error(message);
    };
    socket.on("error", errorListener);
    return () => {
      socket.off("error", errorListener);
    };
  }, [socket]);

  useEffect(() => {
    if (invite) {
      toast.dismiss();
      toast.success("방에 참여하도록 초대되었습니다!");
    }
  }, [invite]);

  return (
    <>
      <Toaster />
      <LandingPageLayout ratio={ratio}>
        <div>
          <Logo />
        </div>
        <AvatarChanger />
        <NicknameInput setNicknameError={setNicknameError} ref={nicknameRef} />
        <Button
          variant="medium"
          onClick={onEnterClick}
          disabled={nicknameError}
        >
          {invite ? "입장" : "생성"}
        </Button>
      </LandingPageLayout>
    </>
  );
};

export default LandingPage;
