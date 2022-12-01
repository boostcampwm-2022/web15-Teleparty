import { useState, useEffect, useRef, useCallback } from "react";

import Peer, { MediaConnection } from "peerjs";

import type {
  Player,
  GamePlayer,
  CatchMindRoundInfo,
  CatchMindRoundEndInfo,
} from "../types/game";
import type { Socket } from "socket.io-client";

type GameState = "inputKeyword" | "drawing" | "roundEnd" | "gameEnd";

const getPeerIdForCatchMind = (id: string) => {
  // PeerJS id제약 때문에 끝에 a를 붙임
  // https://peerjs.com/docs/#api
  return `catchmind-${id}a`;
};

// socket, player, first round info
export const useCatchMind = (
  socket: Socket,
  playerList: Player[],
  initialRoundInfo: CatchMindRoundInfo,
  outgoingCanvasStream: MediaStream | null
) => {
  const [roundInfo, setRoundInfo] =
    useState<CatchMindRoundInfo>(initialRoundInfo);
  const [gameState, setGameState] = useState<GameState>("inputKeyword");
  const [gamePlayerList, setGamePlayerList] = useState<GamePlayer[]>(
    playerList.map((player) => ({
      ...player,
      isCurrentTurn: player.peerId === initialRoundInfo.turnPlayer,
      isReady: false,
      score: 0,
    }))
  );
  const [roundEndInfo, setRoundEndInfo] =
    useState<CatchMindRoundEndInfo | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(
    initialRoundInfo.turnPlayer === socket.id
  );
  const peerRef = useRef(new Peer(getPeerIdForCatchMind(socket.id)));
  const peer = peerRef.current;
  const mediaConnectionListRef = useRef<MediaConnection[]>([]);
  const [incomingCanvasStream, setIncomingCanvasStream] =
    useState<MediaStream | null>(null);

  // socket for game logic
  useEffect(() => {
    const roundStartListener = (roundInfo: CatchMindRoundInfo) => {
      console.log("round start!!: ", roundInfo);
      const { turnPlayer } = roundInfo;
      setGameState("inputKeyword");
      setRoundInfo(roundInfo);
      setIsMyTurn(socket.id === roundInfo.turnPlayer);
      setGamePlayerList(
        gamePlayerList.map((player) => {
          return {
            ...player,
            isReady: false,
            isCurrentTurn: player.peerId === turnPlayer,
          };
        })
      );
    };
    const drawStartListener = () => {
      setGameState("drawing");
    };
    const roundEndListener = (roundEndInfo: CatchMindRoundEndInfo) => {
      const { playerScoreMap, isLastRound } = roundEndInfo;
      setGameState(isLastRound ? "gameEnd" : "roundEnd");
      setRoundEndInfo(roundEndInfo);
      setGamePlayerList(
        gamePlayerList.map((player) => {
          return {
            ...player,
            score: playerScoreMap[player.peerId],
          };
        })
      );
    };
    const roundReadyListener = ({ peerId }: { peerId: string }) => {
      const player = gamePlayerList.find((player) => player.peerId === peerId);
      if (!player) return;
      player.isReady = !player.isReady;
      setGamePlayerList([...gamePlayerList]);
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
  }, [gamePlayerList, socket]);

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
    if (!peer) return;
    peer.on("call", answerCallAndUpdateCanvasStream);
  };

  const clearPeer = () => {
    if (!peer) return;
    peer.off("call", answerCallAndUpdateCanvasStream);
  };

  // peer(WebRTC) for canvas share
  useEffect(() => {
    initPeer();
    return clearPeer;
  }, []);

  const connectToPlayersToSendMyCanvasStream = useCallback(() => {
    if (!outgoingCanvasStream) return;

    for (const { peerId } of gamePlayerList) {
      if (peerId === socket.id) continue;
      const mediaConnection = peer.call(
        getPeerIdForCatchMind(peerId),
        outgoingCanvasStream
      );
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
    gamePlayerList,
    roundEndInfo,
    isMyTurn,
    incomingCanvasStream,
  };
};
