import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import { useAtomValue, useSetAtom } from "jotai";

import { LandingPageLayout } from "./LandingPage.styles";

import { Button } from "../../components/common/Button";
import { Logo } from "../../components/Logo/Logo.component";
import NicknameInput from "../../components/NicknameInput/NicknameInput.component";
import useLanding from "../../hooks/useLanding";
import { ratioAtom } from "../../store/ratio";
import { roomIdAtom } from "../../store/roomId";
import { socketAtom } from "../../store/socket";

const LandingPage = () => {
  const setRoomId = useSetAtom(roomIdAtom);
  const socket = useAtomValue(socketAtom);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const [nicknameError, setNicknameError] = useState(true);
  const ratio = useAtomValue(ratioAtom);
  useLanding();

  const invite = new URLSearchParams(window.location.search).get("invite");

  const onEnterClick = () => {
    if (!nicknameRef.current?.value || nicknameError) return;
    setRoomId(invite);

    // avatar 추가 필요
    socket.emit("join", {
      userName: nicknameRef.current.value,
      avatar: "",
      roomId: invite,
    });
  };

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
