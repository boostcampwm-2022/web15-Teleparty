import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAtomValue, useSetAtom } from "jotai";
import Peer from "peerjs";

import { peerAtom } from "../store/peer";
import { playersAtom } from "../store/players";
import { roomIdAtom } from "../store/roomId";
import { socketAtom } from "../store/socket";
import { Player } from "../types/game";
import { createPeerId } from "../utils/peer";

interface JoinResponse {
  roomId: string;
  players: Player[];
}

const useLanding = () => {
  const navigate = useNavigate();
  const setPlayers = useSetAtom(playersAtom);
  const setPeer = useSetAtom(peerAtom);
  const socket = useAtomValue(socketAtom);
  const setRoomId = useSetAtom(roomIdAtom);

  useEffect(() => {
    const setNewPeer = () => {
      console.log("my id: ", socket.id);
      setPeer(new Peer(createPeerId(socket.id), { debug: 0 }));
    };

    if (socket.connected) setNewPeer();
    else {
      socket.on("connect", setNewPeer);
    }

    return () => {
      socket.off("connect", setNewPeer);
    };
  }, [socket, setPeer]);

  useEffect(() => {
    const joinListener = (joinResponse: JoinResponse) => {
      const { roomId, players } = joinResponse;
      setRoomId(roomId);
      setPlayers((prev) => [
        ...prev,
        ...players.map((player) => ({
          ...player,
          isMicOn: true,
          isAudioDetected: false,
        })),
      ]);
      navigate(`/room`, { replace: true });
    };

    socket.on("join", joinListener);

    return () => {
      socket.off("join", joinListener);
    };
  }, [socket, navigate, setPlayers, setRoomId]);
};

export default useLanding;
