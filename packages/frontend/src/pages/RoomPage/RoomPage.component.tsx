import { Routes, Route } from "react-router-dom";

import { useAtom, useAtomValue } from "jotai";

import Game from "../../components/Game/Game.components";
import Lobby from "../../components/Lobby/Lobby.component";
import { useAudioCommunication } from "../../hooks/useAudioCommunication";
import { useDataConnectionWithPeers } from "../../hooks/useDataConnectionWithPeers";
import usePreventClose from "../../hooks/usePreventClose";
import { peerAtom } from "../../store/peer";
import { playersAtom } from "../../store/players";
import { socketAtom } from "../../store/socket";
import { AudioDetectListener } from "../../utils/audioStreamManager";

const RoomPage = () => {
  const [players, setPlayers] = useAtom(playersAtom);
  const peer = useAtomValue(peerAtom);
  const socket = useAtomValue(socketAtom);

  usePreventClose();

  const changeAudioDetectionStateOfPlayer: AudioDetectListener = (
    id,
    isAudioDetected
  ) => {
    setPlayers((players) =>
      players.map((player) => ({
        ...player,
        isAudioDetected:
          player.peerId === id ? isAudioDetected : player.isAudioDetected,
      }))
    );
  };

  const playerIdList = players
    .map(({ peerId }) => peerId)
    .filter((id) => id !== socket.id);

  useAudioCommunication(peer!, playerIdList, changeAudioDetectionStateOfPlayer);
  useDataConnectionWithPeers(peer!, playerIdList);

  return (
    <Routes>
      <Route index element={<Lobby />}></Route>
      <Route path="game" element={<Game />}></Route>
    </Routes>
  );
};

export default RoomPage;
