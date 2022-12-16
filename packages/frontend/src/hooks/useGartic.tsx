import { useEffect, useState } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import { gameInfoAtom } from "../store/game";
import { playersAtom } from "../store/players";
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
  const setPlayers = useSetAtom(playersAtom);
  const [isLastAlbum, setIsLastAlbum] = useState(false);

  useEffect(() => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        isReady: false,
        isCurrentTurn: false,
        isGameQuit: false,
      }))
    );
  }, [setPlayers]);

  useEffect(() => {
    const gameStartListener = (gameStartResponse: GameInfo) => {
      console.log("gameStart:", gameStartResponse);
      setPlayers((prev) =>
        prev.map((player) => ({ ...player, isReady: false }))
      );
      setGameState("gameStart");
      setRoundInfo(gameStartResponse.roundInfo);
    };
    const drawStartListener = ({ keyword, roundInfo }: DrawStartResponse) => {
      setPlayers((prev) =>
        prev.map((player) => ({ ...player, isReady: false }))
      );
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
      setPlayers((prev) =>
        prev.map((player) => ({ ...player, isReady: false }))
      );
      setImage(img);
      setRoundInfo(roundInfo);
      setGameState("inputKeyword");
    };
    const gameEndListener = () => {
      setGameState("gameEnd");
      setPlayers((prev) =>
        prev.map((player) => ({ ...player, isReady: false }))
      );
      socket.emit("request-album");
    };
    const setDoneOrNot = (peerId: string, isReady: boolean) => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const donePlayer = newPlayers.find(
          (player) => player.peerId === peerId
        );
        if (!donePlayer) return prev;
        donePlayer.isReady = isReady;
        return newPlayers;
      });
    };
    const inputDoneListener = ({ peerId }: { peerId: string }) => {
      console.log("input done");
      setDoneOrNot(peerId, true);
    };
    const inputCancelListener = ({ peerId }: { peerId: string }) => {
      console.log("input cancel");
      setDoneOrNot(peerId, false);
    };
    const albumListener = ({ peerId, isLast, result }: AlbumResponse) => {
      console.log("album:", peerId, isLast, result);
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const convertMyResultToDone = newPlayers.map((player) =>
          player.isCurrentTurn
            ? { ...player, isCurrentTurn: false, isReady: true }
            : player
        );
        const currentPlayer = convertMyResultToDone.find(
          (player) => player.peerId === peerId
        );
        if (!currentPlayer) return prev;
        currentPlayer.isCurrentTurn = true;
        return convertMyResultToDone;
      });
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
  }, [socket, setPlayers]);

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
