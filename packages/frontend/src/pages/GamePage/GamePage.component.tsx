import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAtom, useAtomValue } from "jotai";

import {
  GamePageContentBox,
  GamePageRoundParagraph,
  GamePageLayout,
} from "./GamePage.styles";

import Canvas from "../../components/Canvas/Canvas.component";
import { CanvasLayout } from "../../components/Canvas/Canvas.styles";
import Chat from "../../components/Chat/Chat.component";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import Icon from "../../components/Icon/Icon";
import { Logo } from "../../components/Logo/Logo.component";
import MoonTimer from "../../components/MoonTimer/MoonTimer.component";
import PaintBoard from "../../components/PaintBoard/PaintBoard.component";
import {
  KeywordInputLayout,
  PaintBoardButtonLayout,
} from "../../components/PaintBoard/PaintBoard.styles";
import PaintToolBox from "../../components/PaintToolBox/PaintToolBox.component";
import PlayerList from "../../components/PlayerList/PlayerList.component";
import Rank from "../../components/Rank/Rank.component";
import { useCatchMind } from "../../hooks/useCatchMind";
import { gameInfoAtom } from "../../store/game";
import { playersAtom } from "../../store/players";
import { socketAtom } from "../../store/socket";

const GamePage = () => {
  const [players, setPlayers] = useAtom(playersAtom);
  const [gameInfo, setGameInfo] = useAtom(gameInfoAtom);
  const socket = useAtomValue(socketAtom);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const { gamePlayerList, gameState, isMyTurn, roundEndInfo, roundInfo } =
    useCatchMind(socket, players, gameInfo.roundInfo);

  const { roundTime, currentRound, turnPlayer } = roundInfo;

  const getUserNameById = (id: string | undefined | null) => {
    return gamePlayerList.find(({ peerId }) => peerId === id)?.userName;
  };

  const currentTurnUserName = getUserNameById(turnPlayer);

  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onReady = () => {
    socket.emit("round-ready");
  };

  const onKeywordSubmit = () => {
    if (!keyword) return;
    socket.emit("input-keyword", { keyword });
  };

  const onGoToRoomClick = () => {
    navigate("/room", { replace: true });
  };

  const getHeaderElement = () => {
    switch (gameState) {
      case "inputKeyword":
        return isMyTurn
          ? "제시어를 입력해주세요"
          : `${currentTurnUserName}님이 제시어를 입력하고 있습니다.`;
      case "drawing":
        return isMyTurn
          ? `제시어: ${keyword}`
          : "그림을 보고 제시어를 맞춰 주세요";
      case "roundEnd":
        return `${getUserNameById(
          roundEndInfo?.roundWinner
        )}님이 정답을 맞추셨습니다. 정답: ${roundEndInfo?.suggestedWord}`;
      case "gameEnd":
        return "최종 랭킹";
      default:
        return "잠시만요...";
    }
  };

  const getCenterElement = () => {
    switch (gameState) {
      case "drawing":
        if (isMyTurn) return <Canvas />;
        return <CanvasLayout />;
      case "gameEnd":
        return (
          <Rank
            rankList={gamePlayerList
              .sort((a, b) => b!.score! - a!.score!)
              .map(({ userName, score }) => ({
                userName,
                score: score!,
              }))}
          />
        );
      case "inputKeyword":
        return <CanvasLayout />;
      case "roundEnd":
        return <CanvasLayout />;
      default:
        return null;
    }
  };

  const getFooterElement = () => {
    switch (gameState) {
      case "drawing":
        return isMyTurn ? <PaintToolBox /> : null;
      case "gameEnd":
        return (
          <Button variant="large" onClick={onGoToRoomClick}>
            방으로 이동
          </Button>
        );
      case "inputKeyword":
        return isMyTurn ? (
          <KeywordInputLayout>
            <Input
              variant="medium"
              placeholder="제시어를 입력하세요."
              onChange={onKeywordChange}
            />
          </KeywordInputLayout>
        ) : null;
      case "roundEnd":
        return (
          <PaintBoardButtonLayout>
            <Button variant="icon">
              <Icon icon="download" size={36} />
            </Button>
            <Button variant="large" onClick={onReady}>
              다음 라운드로
            </Button>
          </PaintBoardButtonLayout>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GamePageLayout>
        <GamePageContentBox>
          <GamePageRoundParagraph>
            {currentRound} / {gameInfo.totalRound}
          </GamePageRoundParagraph>
          <PlayerList maxPlayer={10} sizeType="medium" />
        </GamePageContentBox>
        <GamePageContentBox>
          <Logo height={80} />
          <PaintBoard
            headerText={getHeaderElement()}
            centerElement={getCenterElement()}
            footerElement={getFooterElement()}
          />
        </GamePageContentBox>
        <GamePageContentBox>
          {gameState === "drawing" ? (
            <MoonTimer radius={50} secondTime={roundTime} />
          ) : (
            <MoonTimer radius={50} secondTime={Infinity} />
          )}
          <Chat />
          {gameState === "inputKeyword" && isMyTurn && (
            <Button variant="large" onClick={onKeywordSubmit}>
              완료
            </Button>
          )}
        </GamePageContentBox>
      </GamePageLayout>
    </>
  );
};

export default GamePage;
