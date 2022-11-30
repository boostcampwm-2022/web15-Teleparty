import { useEffect, useRef } from "react";

import Peer, { MediaConnection } from "peerjs";

import { voiceInputMediaStreamAtom } from "../store/voiceInputMediaStream";
import { audioStreamManager } from "../utils/audioStreamMap";

const getAudioMediaStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
};

export const useAudioCommunication = (
  peer: Peer | null,
  peerIdList: string[]
) => {
  const mediaConnectionSet = useRef<Set<MediaConnection>>(new Set());
  const connectedPeerIdSet = useRef<Set<string>>(new Set());

  const initMediaConnection = (
    id: string,
    mediaConnection: MediaConnection
  ) => {
    mediaConnectionSet.current.add(mediaConnection);

    mediaConnection.on("stream", (stream) => {
      audioStreamManager.add(id, stream);
      connectedPeerIdSet.current.add(id);
    });

    mediaConnection.on("close", () => {
      mediaConnectionSet.current.delete(mediaConnection);
      audioStreamManager.remove(id);
      connectedPeerIdSet.current.delete(id);
    });

    mediaConnection.on("error", (error) => {
      mediaConnectionSet.current.delete(mediaConnection);
      audioStreamManager.remove(id);
      connectedPeerIdSet.current.delete(id);
      console.error(error);
    });
  };

  // answer to call and handle new MediaConnection
  const handleCall = async (mediaConnection: MediaConnection) => {
    const audioStream = await getAudioMediaStream();
    mediaConnection.answer(audioStream);
    initMediaConnection(mediaConnection.peer, mediaConnection);
  };

  const initPeer = async () => {
    if (!peer) return;
    peer.on("call", handleCall);
  };

  const clearPeer = () => {
    if (!peer) return;
    peer.off("call", handleCall);
  };

  // call to all peers and handle each new MediaConnection
  const connectAudioWithPeers = async () => {
    if (!peer) return;

    const audioStream = await getAudioMediaStream();

    for (const peerId of peerIdList) {
      const mediaConnection = peer.call(peerId, audioStream);
      initMediaConnection(peerId, mediaConnection);
    }
  };

  const closeAllMediaConnections = () => {
    for (const mediaConnection of mediaConnectionSet.current) {
      mediaConnection.close();
    }
    for (const connectedPeerId of connectedPeerIdSet.current) {
      audioStreamManager.remove(connectedPeerId);
    }
  };

  // 1. init peer(WebRTC) to accept incoming audio connection
  // 2. connect audio channel with all peers
  useEffect(() => {
    initPeer();
    connectAudioWithPeers();

    return () => {
      clearPeer();
      closeAllMediaConnections();
    };
  }, []);
};
