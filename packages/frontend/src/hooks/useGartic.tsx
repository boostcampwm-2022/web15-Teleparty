import { useEffect, useState } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import { gameInfoAtom } from "../store/game";
import {
  initGarticGamePlayersAtom,
  playersAtom,
  setPlayerReadyAtom,
  setPlayersReadyAtom,
  updatePlayersNextAlbumTurnAtom,
} from "../store/players";
import { socketAtom } from "../store/socket";

import type { AlbumType, GameInfo, GarticRoundInfo } from "../types/game";

type GarticGameState = "gameStart" | "drawing" | "inputKeyword" | "gameEnd";

interface AlbumResponse {
  peerId: string;
  isLast: boolean;
  result: AlbumType[];
}

interface DrawStartResponse {
  keyword: string;
  roundInfo: GarticRoundInfo;
}
interface KeywordInputStartResponse {
  img: string;
  roundInfo: GarticRoundInfo;
}

const useGartic = () => {
  const socket = useAtomValue(socketAtom);
  const gameInfo = useAtomValue(gameInfoAtom);
  const [keyword, setKeyword] = useState("");
  const [image, setImage] = useState("");
  const [album, setAlbum] = useState<AlbumType[]>([]);
  const [roundInfo, setRoundInfo] = useState<GarticRoundInfo>(
    gameInfo.roundInfo
  );
  const [gameState, setGameState] = useState<GarticGameState>("gameStart");
  const setGamePlayerList = useSetAtom(playersAtom);
  const initGarticGamePlayers = useSetAtom(initGarticGamePlayersAtom);
  const setPlayersReady = useSetAtom(setPlayersReadyAtom);
  const setPlayerReady = useSetAtom(setPlayerReadyAtom);
  const updatePlayersNextAlbumTurn = useSetAtom(updatePlayersNextAlbumTurnAtom);
  const [isLastAlbum, setIsLastAlbum] = useState(false);

  useEffect(() => {
    initGarticGamePlayers();
  }, [initGarticGamePlayers]);

  useEffect(() => {
    const gameStartListener = (gameStartResponse: GameInfo) => {
      console.log("gameStart:", gameStartResponse);
      setPlayersReady(false);
      setGameState("gameStart");
      setRoundInfo(gameStartResponse.roundInfo);
    };
    const drawStartListener = ({ keyword, roundInfo }: DrawStartResponse) => {
      setPlayersReady(false);
      console.log("drawStart:", keyword, roundInfo);
      setKeyword(keyword);
      setRoundInfo(roundInfo);
      setGameState("drawing");
    };
    const keywordInputStartListener = ({
      img,
      roundInfo,
    }: KeywordInputStartResponse) => {
      console.log("keywordInputStart", img, roundInfo);
      setPlayersReady(false);
      setImage(img);
      setRoundInfo(roundInfo);
      setGameState("inputKeyword");
    };
    const gameEndListener = () => {
      setGameState("gameEnd");
      setPlayersReady(false);
      socket.emit("request-album");
    };
    const inputDoneListener = ({ peerId }: { peerId: string }) => {
      console.log("input done");
      setPlayerReady({ playerId: peerId, isReady: true });
    };
    const inputCancelListener = ({ peerId }: { peerId: string }) => {
      console.log("input cancel");
      setPlayerReady({ playerId: peerId, isReady: false });
    };
    const albumListener = ({ peerId, isLast, result }: AlbumResponse) => {
      console.log("album:", peerId, isLast, result);
      updatePlayersNextAlbumTurn(peerId);
      setIsLastAlbum(isLast);
      setAlbum(result);
    };

    socket.on("game-start", gameStartListener);
    socket.on("draw-start", drawStartListener);
    socket.on("keyword-input-start", keywordInputStartListener);
    socket.on("game-end", gameEndListener);
    socket.on("input-keyword", inputDoneListener);
    socket.on("keyword-cancel", inputCancelListener);
    socket.on("draw-input", inputDoneListener);
    socket.on("draw-cancel", inputCancelListener);
    socket.on("album", albumListener);
    return () => {
      socket.off("game-start", gameStartListener);
      socket.off("draw-start", drawStartListener);
      socket.off("keyword-input-start", keywordInputStartListener);
      socket.off("game-end", gameEndListener);
      socket.off("input-keyword", inputDoneListener);
      socket.off("keyword-cancel", inputCancelListener);
      socket.off("draw-input", inputDoneListener);
      socket.off("draw-cancel", inputCancelListener);
      socket.off("album", albumListener);
    };
  }, [socket, setGamePlayerList]);

  return {
    gameState,
    roundInfo,
    keyword,
    image,
    album,
    isLastAlbum,
  };
};

export default useGartic;
