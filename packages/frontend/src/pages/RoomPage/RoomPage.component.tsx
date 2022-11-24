import { useEffect } from "react";
import { Navigate } from "react-router";

import { useAtomValue } from "jotai";

import { Button } from "../../components/common/Button";
import { roomIdAtom } from "../../store/roomId";

const RoomPage = () => {
  const roomId = useAtomValue(roomIdAtom);
  if (roomId === undefined) return <Navigate to="/" replace />;

  const onInviteClick = () => {
    const inviteUrl = `${window.location.origin}/?invite=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
  };

  useEffect(() => {
    console.log(window.location);
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
    <>
      <Button variant="medium" onClick={onInviteClick}>
        초대
      </Button>
    </>
  );
};

export default RoomPage;
