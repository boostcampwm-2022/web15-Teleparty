import { useEffect, useRef } from "react";

import Peer, { MediaConnection } from "peerjs";

import {
  AudioDetectListener,
  audioStreamManager,
} from "../utils/audioStreamManager";
import { createPeerId, restoreIdFromPeerId } from "../utils/peer";

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
  if (!peer.id) {
    console.error(
      "useAudioCommunication에서 connection이 맺어지지 않은 peer를 전달받았습니다!"
    );
  }
  peerIdList = peerIdList.map((id) => createPeerId(id));
  const mediaConnectionMap = useRef<Map<string, MediaConnection>>(new Map());

  const closeAudioConnection = (peerId: string) => {
    const mediaConnection = mediaConnectionMap.current.get(peerId);
    mediaConnection?.close();
    audioStreamManager.removeStream(restoreIdFromPeerId(peerId));
  };

  const initMediaConnection = (
    id: string,
    mediaConnection: MediaConnection
  ) => {
    mediaConnectionMap.current.set(id, mediaConnection);

    mediaConnection.on("stream", (stream) => {
      audioStreamManager.addStream(restoreIdFromPeerId(id), stream);
      if (audioDetectListener)
        audioStreamManager.addAudioDetectListener(
          restoreIdFromPeerId(id),
          audioDetectListener
        );
    });

    mediaConnection.on("close", () => {
      closeAudioConnection(id);
    });

    mediaConnection.on("error", (error) => {
      closeAudioConnection(id);
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
      if (!mediaConnection) {
        console.warn(`${peerId}와 audio communication을 맺는데 실패했습니다!`);
      }
      initMediaConnection(peerId, mediaConnection);
    }
  };

  const closeAllAudioConnections = () => {
    for (const [
      connectedPeerId,
      mediaConnection,
    ] of mediaConnectionMap.current.entries()) {
      mediaConnectionMap.current.delete(connectedPeerId);
      mediaConnection.close();
      audioStreamManager.removeStream(restoreIdFromPeerId(connectedPeerId));
    }
  };

  const initMyAudio = async () => {
    if (!voiceInputMediaStream) {
      voiceInputMediaStream = await getAudioMediaStream();
    }

    // 자신의 mediaStream을 audioStreamManager에 등록 및 audioDetectListener 등록
    audioStreamManager.addStream(
      restoreIdFromPeerId(peer.id),
      voiceInputMediaStream,
      {
        autoPlay: false,
      }
    );
    if (audioDetectListener) {
      audioStreamManager.addAudioDetectListener(
        restoreIdFromPeerId(peer.id),
        audioDetectListener
      );
    }
  };

  const clearMyAudio = () => {
    if (!voiceInputMediaStream) return;
    voiceInputMediaStream.getTracks().forEach((track) => track.stop());
    voiceInputMediaStream = null;
    audioStreamManager.removeStream(restoreIdFromPeerId(peer.id));
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
      closeAllAudioConnections();
      clearMyAudio();
    };
  }, []);

  // player id list 변경시 제거된 id를 찾아 audio connection 해제 및 관련 자원 반환
  useEffect(() => {
    const removedIdList = [];
    for (const peerId of mediaConnectionMap.current.keys()) {
      if (!peerIdList.includes(peerId)) removedIdList.push(peerId);
    }

    for (const removedId of removedIdList) {
      closeAudioConnection(removedId);
    }
  }, [peerIdList]);
};
