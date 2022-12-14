import React, { useEffect, useRef, useState } from "react";

import { useAtomValue } from "jotai";

import {
  GarticDrawImage,
  GarticResultContentLayout,
  GarticResultLayout,
} from "./Gartic.styles";

import useGartic from "../../../hooks/useGartic";
import { gameInfoAtom } from "../../../store/game";
import { playersAtom, isPlayerReady } from "../../../store/players";
import { socketAtom } from "../../../store/socket";
import Album from "../../Album/Album.component";
import Canvas from "../../Canvas/Canvas.component";
import { CanvasLayout } from "../../Canvas/Canvas.styles";
import Chat from "../../Chat/Chat.component";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { Logo } from "../../Logo/Logo.component";
import MoonTimer from "../../MoonTimer/MoonTimer.component";
import PaintBoard from "../../PaintBoard/PaintBoard.component";
import { KeywordInputLayout } from "../../PaintBoard/PaintBoard.styles";
import PaintToolBox from "../../PaintToolBox/PaintToolBox.component";
import PlayerList from "../../PlayerList/PlayerList.component";
import {
  GameContentBox,
  GameRoundParagraph,
  GameCenterContentBox,
} from "../Game.styles";

const Gartic = () => {
  const {
    gameState,
    album,
    image,
    isLastAlbum,
    keyword,
    roundInfo: { currentRound, roundTime },
  } = useGartic();
  const gameInfo = useAtomValue(gameInfoAtom);
  const socket = useAtomValue(socketAtom);
  const players = useAtomValue(playersAtom);
  const isDone = isPlayerReady(players, socket.id);
  const [isKeywordEmpty, setIsKeywordEmpty] = useState(false);
  const keywordInputRef = useRef("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const keywordButtonClick = () => {
    if (isDone) {
      socket.emit("keyword-cancel");
      return;
    }
    socket.emit("input-keyword", { keyword: keywordInputRef.current });
  };

  const onKeywordInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) setIsKeywordEmpty(true);
    else setIsKeywordEmpty(false);
    keywordInputRef.current = value;
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
    gameStart: "???????????? ??????????????????",
    drawing: `?????????: ${keyword}`,
    inputKeyword: "????????? ?????? ???????????? ??????????????????.",
  };
  const centerElementMap = {
    gameStart: <CanvasLayout />,
    drawing: <Canvas readonly={isDone} canvasRef={canvasRef} />,
    inputKeyword: <GarticDrawImage src={image} alt="draw" width={1036} />,
  };
  const KeywordInput = (
    <KeywordInputLayout>
      <Input
        disabled={isDone}
        variant="medium"
        placeholder="???????????? ???????????????."
        onChange={onKeywordInputChange}
      />
    </KeywordInputLayout>
  );
  const footerElementMap = {
    gameStart: KeywordInput,
    drawing: <PaintToolBox />,
    inputKeyword: KeywordInput,
  };

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
      <GameContentBox>
        <GameRoundParagraph>
          {currentRound} / {gameInfo.totalRound}
        </GameRoundParagraph>
        <PlayerList maxPlayer={10} sizeType="medium" />
      </GameContentBox>
      <GameCenterContentBox>
        <Logo height={70} />
        <PaintBoard
          headerText={headerElementMap[gameState]}
          centerElement={centerElementMap[gameState]}
          footerElement={footerElementMap[gameState]}
        />
      </GameCenterContentBox>
      <GameContentBox>
        <MoonTimer radius={65} secondTime={roundTime} gameState={gameState} />
        <Chat />
        <Button
          variant="medium-large"
          onClick={buttonClickMap[gameState]}
          disabled={
            (gameState === "gameStart" || gameState === "inputKeyword") &&
            isKeywordEmpty
          }
        >
          {isDone ? "??????" : "??????"}
        </Button>
      </GameContentBox>
    </>
  ) : (
    <GarticResultLayout>
      <Logo height={80} />
      <GarticResultContentLayout>
        <GameContentBox>
          <PlayerList maxPlayer={10} sizeType="large" />
        </GameContentBox>
        <GameContentBox>
          <Album album={album} isLastAlbum={isLastAlbum} />
          <Chat variant="horizontal" />
        </GameContentBox>
      </GarticResultContentLayout>
    </GarticResultLayout>
  );
};

export default Gartic;
