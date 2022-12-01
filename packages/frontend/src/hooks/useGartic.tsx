import { useEffect, useState } from "react";

import { useAtomValue } from "jotai";

import { gameInfoAtom } from "../store/game";
import { playersAtom } from "../store/players";
import { socketAtom } from "../store/socket";
import { GameInfo, GarticPlayer, GarticRoundInfo } from "../types/game";

type GarticGameState = "gameStart" | "drawing" | "inputKeyword" | "gameEnd";

interface AlbumResponse {
  peerId: string;
  isLast: boolean;
  result: Album[];
}
interface Album {
  peerId: string;
  keyword?: string;
  img?: string;
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
  const playerList = useAtomValue(playersAtom);
  const gameInfo = useAtomValue(gameInfoAtom);
  const [keyword, setKeyword] = useState("");
  const [image, setImage] = useState("");
  const [album, setAlbum] = useState<Album[]>([]);
  const [roundInfo, setRoundInfo] = useState<GarticRoundInfo>(
    gameInfo.roundInfo
  );
  const [gameState, setGameState] = useState<GarticGameState>("gameStart");
  const [garticPlayerList, setGarticPlayerList] = useState<GarticPlayer[]>(
    playerList.map((player) => ({
      ...player,
      isDone: false,
      isMyResult: false,
    }))
  );
  const [isLastAlbum, setIsLastAlbum] = useState(false);

  useEffect(() => {
    const gameStartListener = (gameStartResponse: GameInfo) => {
      setGameState("gameStart");
      setRoundInfo(gameStartResponse.roundInfo);
    };
    const drawStartListener = ({ keyword, roundInfo }: DrawStartResponse) => {
      setKeyword(keyword);
      setRoundInfo(roundInfo);
      setGameState("drawing");
    };
    const keywordInputStartListener = ({
      img,
      roundInfo,
    }: KeywordInputStartResponse) => {
      setImage(img);
      setRoundInfo(roundInfo);
      setGameState("inputKeyword");
    };
    const gameEndListener = () => {
      setGameState("gameEnd");
    };
    const setDoneOrNot = (peerId: string, isDone: boolean) => {
      setGarticPlayerList((prev) => {
        const copiedList = [...prev];
        const donePlayerIndex = copiedList.findIndex(
          (player) => player.peerId === peerId
        );
        copiedList[donePlayerIndex].isDone = isDone;
        return copiedList;
      });
    };
    const inputDoneListener = ({ peerId }: { peerId: string }) => {
      setDoneOrNot(peerId, true);
    };
    const inputCancelListener = ({ peerId }: { peerId: string }) => {
      setDoneOrNot(peerId, false);
    };
    const albumListener = ({ peerId, isLast, result }: AlbumResponse) => {
      setGarticPlayerList((prev) => {
        const copiedList = [...prev];
        const convertMyResultToDone = copiedList.map((player) =>
          player.isMyResult
            ? { ...player, isMyResult: false, isDone: true }
            : player
        );
        const currentPlayerIndex = convertMyResultToDone.findIndex(
          (player) => player.peerId === peerId
        );
        convertMyResultToDone[currentPlayerIndex].isMyResult = true;
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
    socket.on("game-end", gameEndListener);
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
      socket.off("game-end", gameEndListener);
      socket.off("album", albumListener);
    };
  }, [socket]);

  return {
    gameState,
    garticPlayerList,
    roundInfo,
    keyword,
    image,
    album,
    isLastAlbum,
  };
};

export default useGartic;
