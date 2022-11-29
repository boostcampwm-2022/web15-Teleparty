import { useEffect } from "react";

import Peer, { MediaConnection } from "peerjs";

export const useAudioCommunication = (
  peer: Peer | null,
  peerIdList: string[]
) => {
  const initMediaConnection = (mediaConnection: MediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      const audio = new Audio();
      audio.autoplay = true;
      audio.srcObject = stream;
    });

    mediaConnection.on("close", () => {
      console.log("call closed");
    });

    mediaConnection.on("error", (error) => {
      console.error(error);
    });
  };

  const initPeer = async () => {
    if (!peer) return;

    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    peer.on("call", (mediaConnection) => {
      mediaConnection.answer(audioStream);
      initMediaConnection(mediaConnection);
    });
  };

  const connectRtcToRoomPlayers = async () => {
    if (!peer) return;

    for (const peerId of peerIdList) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      const mediaConnection = peer.call(peerId, mediaStream);
      initMediaConnection(mediaConnection);
    }
  };

  useEffect(() => {
    if (!peer) return;
    initPeer();
    connectRtcToRoomPlayers();
  }, []);
};
