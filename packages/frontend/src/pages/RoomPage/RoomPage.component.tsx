import { Routes, Route } from "react-router-dom";

import { useAtom, useAtomValue, useSetAtom } from "jotai";

import Game from "../../components/Game/Game.components";
import Lobby from "../../components/Lobby/Lobby.component";
import { useAudioCommunication } from "../../hooks/useAudioCommunication";
import { useDataConnectionWithPeers } from "../../hooks/useDataConnectionWithPeers";
import usePreventClose from "../../hooks/usePreventClose";
import { peerAtom } from "../../store/peer";
import {
  playerIdsAtom,
  setPlayerisAudioDetectedAtom,
} from "../../store/players";
import { socketAtom } from "../../store/socket";
import { AudioDetectListener } from "../../utils/audioStreamManager";

const RoomPage = () => {
  const setPlayerisAudioDetected = useSetAtom(setPlayerisAudioDetectedAtom);
  const [playerIds] = useAtom(playerIdsAtom);
  const peer = useAtomValue(peerAtom);
  const socket = useAtomValue(socketAtom);
  const peerIdList = playerIds.filter((id) => id !== socket.id);

  usePreventClose();

  const changeAudioDetectionStateOfPlayer: AudioDetectListener = (
    id,
    isAudioDetected
  ) => {
    console.log(id);
    setPlayerisAudioDetected({ playerId: id, isAudioDetected });
  };

  useAudioCommunication(peer!, peerIdList, changeAudioDetectionStateOfPlayer);
  useDataConnectionWithPeers(peer!, peerIdList);

  return (
    <Routes>
      <Route index element={<Lobby />}></Route>
      <Route path="game" element={<Game />}></Route>
    </Routes>
  );
};

export default RoomPage;
