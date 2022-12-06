import { useEffect, useRef } from "react";

import Peer, { MediaConnection } from "peerjs";

import {
  AudioDetectListener,
  audioStreamManager,
} from "../utils/audioStreamManager";

const getAudioMediaStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
};

export let voiceInputMediaStream: MediaStream | null = null;

export const useAudioCommunication = (
  peer: Peer,
  peerIdList: string[],
  audioDetectListener?: AudioDetectListener
) => {
  const mediaConnectionMap = useRef<Map<string, MediaConnection>>(new Map());

  const closeConnection = (id: string) => {
    const mediaConnection = mediaConnectionMap.current.get(id);
    mediaConnection?.close();
    audioStreamManager.removeStream(id);
  };

  const initMediaConnection = (
    id: string,
    mediaConnection: MediaConnection
  ) => {
    mediaConnectionMap.current.set(id, mediaConnection);

    mediaConnection.on("stream", (stream) => {
      audioStreamManager.addStream(id, stream);
      if (audioDetectListener)
        audioStreamManager.addAudioDetectListener(id, audioDetectListener);
    });

    mediaConnection.on("close", () => {
      closeConnection(id);
    });

    mediaConnection.on("error", (error) => {
      closeConnection(id);
      console.error(error);
    });
  };

  // answer to call and handle new MediaConnection
  const handleCall = (mediaConnection: MediaConnection) => {
    if (!voiceInputMediaStream) return;

    mediaConnection.answer(voiceInputMediaStream);
    initMediaConnection(mediaConnection.peer, mediaConnection);
  };

  const initPeer = () => {
    peer.on("call", handleCall);
  };

  const clearPeer = () => {
    peer.off("call", handleCall);
  };

  // call to all peers and handle each new MediaConnection
  const connectAudioWithPeers = () => {
    if (!voiceInputMediaStream) return;

    for (const peerId of peerIdList) {
      const mediaConnection = peer.call(peerId, voiceInputMediaStream);
      initMediaConnection(peerId, mediaConnection);
    }
  };

  const closeAllMediaConnections = () => {
    for (const [
      connectedPeerId,
      mediaConnection,
    ] of mediaConnectionMap.current.entries()) {
      mediaConnectionMap.current.delete(connectedPeerId);
      mediaConnection.close();
      audioStreamManager.removeStream(connectedPeerId);
    }
  };

  const initMyAudio = async () => {
    if (!voiceInputMediaStream) {
      voiceInputMediaStream = await getAudioMediaStream();
    }

    // 자신의 mediaStream을 audioStreamManager에 등록 및 audioDetectListener 등록
    audioStreamManager.addStream(peer.id, voiceInputMediaStream, {
      autoPlay: false,
    });
    if (audioDetectListener) {
      audioStreamManager.addAudioDetectListener(peer.id, audioDetectListener);
    }
  };

  const clearMyAudio = () => {
    if (!voiceInputMediaStream) return;
    voiceInputMediaStream.getTracks().forEach((track) => track.stop());
    voiceInputMediaStream = null;
    audioStreamManager.removeStream(peer.id);
  };

  // 1. init peer(WebRTC) to accept incoming audio connection
  // 2. connect audio channel with all peers
  useEffect(() => {
    const initAudioCommunication = async () => {
      await initMyAudio();
      initPeer();
      connectAudioWithPeers();
    };

    initAudioCommunication();

    return () => {
      clearPeer();
      closeAllMediaConnections();
      clearMyAudio();
    };
  }, []);
};
