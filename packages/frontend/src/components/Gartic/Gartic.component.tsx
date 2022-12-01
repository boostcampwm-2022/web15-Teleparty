import React, { useRef, useState } from "react";

import { useAtomValue } from "jotai";

import useGartic from "../../hooks/useGartic";
import {
  GamePageContentBox,
  GamePageRoundParagraph,
} from "../../pages/GamePage/GamePage.styles";
import { gameInfoAtom } from "../../store/game";
import { socketAtom } from "../../store/socket";
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
  const onButtonClick = () => {
    buttonClickMap[gameState]();
  };
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
  };

  const buttonClickMap = {
    gameStart: keywordButtonClick,
    drawing: () => {
      return;
    },
    inputKeyword: () => {
      return;
    },
    gameEnd: () => {
      return;
    },
  };
  const headerElementMap = {
    gameStart: "제시어를 입력해주세요",
    drawing: `제시어: ${keyword}`,
    inputKeyword: "",
    gameEnd: "",
  };
  const centerElementMap = {
    gameStart: <CanvasLayout />,
    drawing: <Canvas canvasRef={canvasRef} />,
    inputKeyword: null,
    gameEnd: null,
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
    inputKeyword: null,
    gameEnd: null,
  };

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
        <MoonTimer radius={50} secondTime={roundTime} />
        <Chat />
        <Button
          variant="large"
          onClick={onButtonClick}
          disabled={
            (gameState === "gameStart" || gameState === "inputKeyword") &&
            !keywordInput
          }
        >
          {isDone ? "편집" : "완료"}
        </Button>
      </GamePageContentBox>
    </>
  ) : null;
};

export default Gartic;
