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

  usePreventClose();

  const changeAudioDetectionStateOfPlayer: AudioDetectListener = (
    id,
    isAudioDetected
  ) => {
    setPlayerisAudioDetected({ playerId: id, isAudioDetected });
  };

  useAudioCommunication(peer!, playerIds, changeAudioDetectionStateOfPlayer);
  useDataConnectionWithPeers(peer!, playerIds);

  return (
    <Routes>
      <Route index element={<Lobby />}></Route>
      <Route path="game" element={<Game />}></Route>
    </Routes>
  );
};

export default RoomPage;
