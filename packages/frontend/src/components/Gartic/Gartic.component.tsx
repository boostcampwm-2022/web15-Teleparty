import React, { useEffect, useRef, useState } from "react";

import { useAtomValue } from "jotai";

import {
  GarticDrawImage,
  GarticResultContentLayout,
  GarticResultLayout,
} from "./Gartic.styles";

import useGartic from "../../hooks/useGartic";
import {
  GamePageContentBox,
  GamePageRoundParagraph,
} from "../../pages/GamePage/GamePage.styles";
import { gameInfoAtom } from "../../store/game";
import { socketAtom } from "../../store/socket";
import Album from "../Album/Album.component";
import Canvas from "../Canvas/Canvas.component";
import { CanvasLayout } from "../Canvas/Canvas.styles";
import Chat from "../Chat/Chat.component";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Logo } from "../Logo/Logo.component";
import MoonTimer from "../MoonTimer/MoonTimer.component";
import PaintBoard from "../PaintBoard/PaintBoard.component";
import { KeywordInputLayout } from "../PaintBoard/PaintBoard.styles";
import PaintToolBox from "../PaintToolBox/PaintToolBox.component";
import PlayerList from "../PlayerList/PlayerList.component";

const Gartic = () => {
  const {
    gameState,
    album,
    garticPlayerList,
    image,
    isLastAlbum,
    keyword,
    roundInfo: { currentRound, roundTime },
  } = useGartic();
  const gameInfo = useAtomValue(gameInfoAtom);
  const socket = useAtomValue(socketAtom);
  const isDone =
    garticPlayerList.find((player) => player.peerId === socket.id)?.isDone ??
    false;
  const [keywordInput, setKeywordInput] = useState("");
  const keywordInputRef = useRef("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const keywordButtonClick = () => {
    if (isDone) {
      socket.emit("keyword-cancel");
      return;
    }
    socket.emit("input-keyword", { keyword: keywordInput });
  };

  const onKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
    keywordInputRef.current = e.target.value;
  };

  const drawingButtonClick = () => {
    if (isDone) {
      socket.emit("draw-cancel");
      return;
    }
    if (!canvasRef.current) return;
    const img = canvasRef.current.toDataURL();
    socket.emit("draw-input", { img });
  };

  const buttonClickMap = {
    gameStart: keywordButtonClick,
    drawing: drawingButtonClick,
    inputKeyword: keywordButtonClick,
  };
  const headerElementMap = {
    gameStart: "제시어를 입력해주세요",
    drawing: `제시어: ${keyword}`,
    inputKeyword: "그림을 보고 제시어를 입력해주세요.",
  };
  const centerElementMap = {
    gameStart: <CanvasLayout />,
    drawing: <Canvas canvasRef={canvasRef} />,
    inputKeyword: <GarticDrawImage src={image} alt="draw" width={1036} />,
  };
  const footerElementMap = {
    gameStart: (
      <KeywordInputLayout>
        <Input
          disabled={isDone}
          variant="medium"
          placeholder="제시어를 입력하세요."
          onChange={onKeywordInputChange}
        />
      </KeywordInputLayout>
    ),
    drawing: <PaintToolBox />,
    inputKeyword: (
      <KeywordInputLayout>
        <Input
          disabled={isDone}
          variant="medium"
          placeholder="제시어를 입력하세요."
          onChange={onKeywordInputChange}
        />
      </KeywordInputLayout>
    ),
  };

  useEffect(() => {
    setKeywordInput("");
  }, [gameState]);

  useEffect(() => {
    const timeOutListener = () => {
      if (gameState === "gameStart" || gameState === "inputKeyword")
        socket.emit("input-keyword", { keyword: keywordInputRef.current });
      if (gameState === "drawing") {
        if (!canvasRef.current) return;
        const img = canvasRef.current.toDataURL();
        socket.emit("draw-input", { img });
      }
    };
    socket.on("time-out", timeOutListener);
    return () => {
      socket.off("time-out", timeOutListener);
    };
  }, [socket, gameState]);

  return gameState !== "gameEnd" ? (
    <>
      <GamePageContentBox>
        <GamePageRoundParagraph>
          {currentRound} / {gameInfo.totalRound}
        </GamePageRoundParagraph>
        <PlayerList maxPlayer={10} sizeType="medium" />
      </GamePageContentBox>
      <GamePageContentBox>
        <Logo height={80} />
        <PaintBoard
          headerText={headerElementMap[gameState]}
          centerElement={centerElementMap[gameState]}
          footerElement={footerElementMap[gameState]}
        />
      </GamePageContentBox>
      <GamePageContentBox>
        <MoonTimer radius={60} secondTime={roundTime} gameState={gameState} />
        <Chat />
        <Button
          variant="large"
          onClick={buttonClickMap[gameState]}
          disabled={
            (gameState === "gameStart" || gameState === "inputKeyword") &&
            !keywordInput
          }
        >
          {isDone ? "편집" : "완료"}
        </Button>
      </GamePageContentBox>
    </>
  ) : (
    <GarticResultLayout>
      <Logo height={80} />
      <GarticResultContentLayout>
        <GamePageContentBox>
          <PlayerList maxPlayer={10} sizeType="large" />
        </GamePageContentBox>
        <GamePageContentBox>
          <Album album={album} isLastAlbum={isLastAlbum} />
          <Chat variant="horizontal" />
        </GamePageContentBox>
      </GarticResultContentLayout>
    </GarticResultLayout>
  );
};

export default Gartic;
