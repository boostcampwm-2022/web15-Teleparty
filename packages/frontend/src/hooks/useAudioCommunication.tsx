import { useEffect, useRef } from "react";

import Peer, { MediaConnection } from "peerjs";

import {
  AudioDetectListener,
  audioStreamManager,
} from "../utils/audioStreamMap";

const getAudioMediaStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
};

export let voiceInputMediaStream: MediaStream | null = null;

export const useAudioCommunication = (
  peer: Peer | null,
  peerIdList: string[],
  audioDetectListener?: AudioDetectListener
) => {
  const mediaConnectionSet = useRef<Set<MediaConnection>>(new Set());
  const connectedPeerIdSet = useRef<Set<string>>(new Set());

  const initMediaConnection = (
    id: string,
    mediaConnection: MediaConnection
  ) => {
    mediaConnectionSet.current.add(mediaConnection);

    mediaConnection.on("stream", (stream) => {
      audioStreamManager.addStream(id, stream);
      if (audioDetectListener) {
        audioStreamManager.addAudioDetectListener(id, audioDetectListener);
      }
      connectedPeerIdSet.current.add(id);
    });

    mediaConnection.on("close", () => {
      mediaConnectionSet.current.delete(mediaConnection);
      audioStreamManager.removeStream(id);
      connectedPeerIdSet.current.delete(id);
    });

    mediaConnection.on("error", (error) => {
      mediaConnectionSet.current.delete(mediaConnection);
      audioStreamManager.removeStream(id);
      connectedPeerIdSet.current.delete(id);
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
    if (!peer) return;
    peer.on("call", handleCall);
  };

  const clearPeer = () => {
    if (!peer) return;
    peer.off("call", handleCall);
  };

  // call to all peers and handle each new MediaConnection
  const connectAudioWithPeers = () => {
    if (!peer) return;

    if (!voiceInputMediaStream) return;

    for (const peerId of peerIdList) {
      const mediaConnection = peer.call(peerId, voiceInputMediaStream);
      initMediaConnection(peerId, mediaConnection);
    }
  };

  const closeAllMediaConnections = () => {
    for (const mediaConnection of mediaConnectionSet.current) {
      mediaConnection.close();
    }
    for (const connectedPeerId of connectedPeerIdSet.current) {
      audioStreamManager.removeStream(connectedPeerId);
    }
  };

  // 1. init peer(WebRTC) to accept incoming audio connection
  // 2. connect audio channel with all peers
  useEffect(() => {
    const initAudioConnection = async () => {
      if (!voiceInputMediaStream)
        voiceInputMediaStream = await getAudioMediaStream();
      if (!peer) return;
      audioStreamManager.addStream(peer.id, voiceInputMediaStream);
      if (audioDetectListener) {
        audioStreamManager.addAudioDetectListener(peer.id, audioDetectListener);
      }

      initPeer();
      connectAudioWithPeers();
    };
    initAudioConnection();

    return () => {
      clearPeer();
      closeAllMediaConnections();
    };
  }, []);
};
