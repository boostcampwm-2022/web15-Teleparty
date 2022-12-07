import { useState, useEffect, useRef, useCallback } from "react";

import { useAtom } from "jotai";
import Peer, { MediaConnection } from "peerjs";

import { playersAtom } from "../store/players";

import type { CatchMindRoundInfo, CatchMindRoundEndInfo } from "../types/game";
import type { Socket } from "socket.io-client";

type GameState = "inputKeyword" | "drawing" | "roundEnd" | "gameEnd";
let catchMindPlayCount = 0;

const getPeerIdForCatchMind = (id: string) => {
  // PeerJS id제약 때문에 끝에 catchMindPlayCount를 붙임
  // 계속 증가하는 카운트를 사용하여 같은 게임을 2회 이상 플레이 했을 때 id 중복을 방지
  // https://peerjs.com/docs/#api
  return `catchmind-${id}${catchMindPlayCount}`;
};

// socket, player, first round info
export const useCatchMind = (
  socket: Socket,
  initialRoundInfo: CatchMindRoundInfo,
  outgoingCanvasStream: MediaStream | null
) => {
  const [roundInfo, setRoundInfo] =
    useState<CatchMindRoundInfo>(initialRoundInfo);
  const [gameState, setGameState] = useState<GameState>("inputKeyword");
  const [gamePlayerList, setGamePlayerList] = useAtom(playersAtom);
  const [roundEndInfo, setRoundEndInfo] =
    useState<CatchMindRoundEndInfo | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(
    initialRoundInfo.turnPlayer === socket.id
  );
  const peerRef = useRef<Peer | null>(null);
  const peer = peerRef.current;
  const mediaConnectionListRef = useRef<MediaConnection[]>([]);
  const [incomingCanvasStream, setIncomingCanvasStream] =
    useState<MediaStream | null>(null);

  useEffect(() => {
    setGamePlayerList((prev) =>
      prev.map((player) => ({
        ...player,
        isReady: false,
        isCurrentTurn: player.peerId === initialRoundInfo.turnPlayer,
        score: 0,
      }))
    );
  }, [setGamePlayerList, initialRoundInfo]);

  // socket for game logic
  useEffect(() => {
    const roundStartListener = (roundInfo: CatchMindRoundInfo) => {
      console.log("round start!!: ", roundInfo);
      const { turnPlayer } = roundInfo;
      setGameState("inputKeyword");
      setRoundInfo(roundInfo);
      setIsMyTurn(socket.id === roundInfo.turnPlayer);
      setGamePlayerList((prev) =>
        prev.map((player) => ({
          ...player,
          isReady: false,
          isCurrentTurn: player.peerId === turnPlayer,
        }))
      );
    };
    const drawStartListener = () => {
      setGameState("drawing");
    };
    const roundEndListener = (roundEndInfo: CatchMindRoundEndInfo) => {
      const { playerScoreMap, isLastRound } = roundEndInfo;
      setGameState(isLastRound ? "gameEnd" : "roundEnd");
      setRoundEndInfo(roundEndInfo);
      setGamePlayerList((prev) =>
        prev.map((player) => ({
          ...player,
          score: playerScoreMap[player.peerId],
        }))
      );
    };
    const roundReadyListener = ({ peerId }: { peerId: string }) => {
      setGamePlayerList((prev) => {
        const newPlayerList = [...prev];
        const playerIndex = newPlayerList.findIndex(
          (player) => player.peerId === peerId
        );
        if (playerIndex === -1) return prev;
        newPlayerList[playerIndex].isReady =
          !newPlayerList[playerIndex].isReady;
        return newPlayerList;
      });
    };
    socket.on("round-start", roundStartListener);
    socket.on("draw-start", drawStartListener);
    socket.on("round-end", roundEndListener);
    socket.on("round-ready", roundReadyListener);
    return () => {
      socket.off("round-start", roundStartListener);
      socket.off("draw-start", drawStartListener);
      socket.off("round-end", roundEndListener);
      socket.off("round-ready", roundReadyListener);
    };
  }, [socket, setGamePlayerList]);

  const initMediaConnection = (mediaConnection: MediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      setIncomingCanvasStream(stream);
    });

    mediaConnection.on("close", () => {
      setIncomingCanvasStream(null);
    });

    mediaConnection.on("error", (error) => {
      setIncomingCanvasStream(null);
      console.log(error);
    });
  };

  const answerCallAndUpdateCanvasStream = (
    mediaConnection: MediaConnection
  ) => {
    mediaConnection.answer();
    initMediaConnection(mediaConnection);
  };

  const initPeer = () => {
    peerRef.current = new Peer(getPeerIdForCatchMind(socket.id));
    peerRef.current.on("call", answerCallAndUpdateCanvasStream);
  };

  const clearPeer = () => {
    if (!peer) return;
    peer.off("call", answerCallAndUpdateCanvasStream);
    peer.destroy();
  };

  // peer(WebRTC) for canvas share
  useEffect(() => {
    catchMindPlayCount++;
    initPeer();
    return clearPeer;
  }, []);

  const connectToPlayersToSendMyCanvasStream = useCallback(() => {
    if (!outgoingCanvasStream || !peer) return;

    for (const { peerId } of gamePlayerList) {
      if (peerId === socket.id) continue;
      const mediaConnection = peer.call(
        getPeerIdForCatchMind(peerId),
        outgoingCanvasStream
      );
      console.log("call id: ", peerId);
      console.log("mediaConnection by call: ", mediaConnection);
      mediaConnectionListRef.current.push(mediaConnection);
    }
  }, [peer, socket, outgoingCanvasStream, gamePlayerList]);

  const clearAllMediaConnection = () => {
    for (const connection of mediaConnectionListRef.current) {
      connection.close();
    }
  };

  useEffect(() => {
    if (!outgoingCanvasStream) return;
    connectToPlayersToSendMyCanvasStream();

    return clearAllMediaConnection;
  }, [outgoingCanvasStream]);

  return {
    roundInfo,
    gameState,
    roundEndInfo,
    isMyTurn,
    incomingCanvasStream,
  };
};
