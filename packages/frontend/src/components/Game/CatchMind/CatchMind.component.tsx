import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAtom, useAtomValue } from "jotai";

import { CANVAS_SIZE } from "../../../constants/canvas";
import { useCatchMind } from "../../../hooks/useCatchMind";
import useCreateImage from "../../../hooks/useCreateImage";
import useGetUsername from "../../../hooks/useUsername";
import { dataConnectionMapAtom } from "../../../store/dataConnectionMap";
import { gameInfoAtom } from "../../../store/game";
import { playersAtom } from "../../../store/players";
import { socketAtom } from "../../../store/socket";
import Canvas from "../../Canvas/Canvas.component";
import Chat from "../../Chat/Chat.component";
import { Button } from "../../common/Button";
import { HidableBox } from "../../common/HidableBox";
import { Input } from "../../common/Input";
import Icon from "../../Icon/Icon";
import { Logo } from "../../Logo/Logo.component";
import MoonTimer from "../../MoonTimer/MoonTimer.component";
import PaintBoard from "../../PaintBoard/PaintBoard.component";
import {
  KeywordInputLayout,
  PaintBoardButtonLayout,
  PaintBoardEmptyCenterElement,
} from "../../PaintBoard/PaintBoard.styles";
import PaintToolBox from "../../PaintToolBox/PaintToolBox.component";
import PlayerList from "../../PlayerList/PlayerList.component";
import Rank from "../../Rank/Rank.component";
import {
  GameContentBox,
  GameRoundParagraph,
  GameCenterContentBox,
} from "../Game.styles";

const CatchMind = () => {
  const [players, setPlayers] = useAtom(playersAtom);
  const gameInfo = useAtomValue(gameInfoAtom);
  const socket = useAtomValue(socketAtom);
  const [isKeywordEmpty, setIsKeywordEmpty] = useState(false);
  const keywordRef = useRef("");
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);
  const dataConnectionMap = useAtomValue(dataConnectionMapAtom);
  const {
    gameState,
    isMyTurn,
    roundEndInfo,
    roundInfo: { currentRound, roundTime, turnPlayer },
  } = useCatchMind(socket, gameInfo.roundInfo);
  const onDownloadClick = useCreateImage({
    targetCanvas: downloadCanvasRef.current,
    originalCanvas: canvasRef.current,
    keyword: roundEndInfo?.suggestedWord ?? "",
  });
  const getUserNameById = useGetUsername();

  const currentTurnUserName = getUserNameById(turnPlayer);

  const onKeywordChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) setIsKeywordEmpty(true);
    else setIsKeywordEmpty(false);
    keywordRef.current = value;
  };

  const onReady = () => {
    socket.emit("round-ready");
  };

  const onKeywordSubmit = () => {
    if (!keywordRef.current) return;
    socket.emit("input-keyword", { keyword: keywordRef.current });
  };

  const onGoToRoomClick = () => {
    socket.emit("quit-game");
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
          ? `제시어: ${keywordRef.current}`
          : "그림을 보고 제시어를 맞춰 주세요";
      case "roundEnd":
        return roundEndInfo?.roundWinner
          ? `${getUserNameById(
              roundEndInfo.roundWinner
            )}님이 정답을 맞추셨습니다. 정답: ${roundEndInfo.suggestedWord}`
          : `아무도 정답을 맞추지 못했습니다. 정답: ${roundEndInfo?.suggestedWord}`;
      case "gameEnd":
        return "최종 랭킹";
      default:
        return "잠시만요...";
    }
  };

  const getCenterElement = () => {
    switch (gameState) {
      case "drawing":
        if (isMyTurn)
          return (
            <Canvas
              canvasRef={canvasRef}
              dataConnections={[...dataConnectionMap.values()]}
            />
          );
        return (
          <Canvas
            canvasRef={canvasRef}
            readonly={true}
            dataConnections={[...dataConnectionMap.values()]}
          />
        );
      case "gameEnd":
        return (
          <Rank
            rankList={players
              .map(({ userName, score, avatarURL }) => ({
                userName,
                score: score ?? 0,
                avatarURL,
              }))
              .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))}
          />
        );
      case "inputKeyword":
        return <PaintBoardEmptyCenterElement />;
      case "roundEnd":
        return (
          <Canvas
            canvasRef={canvasRef}
            readonly={true}
            dataConnections={[...dataConnectionMap.values()]}
          />
        );
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
            <Button variant="icon" onClick={onDownloadClick}>
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
      <GameContentBox>
        <GameRoundParagraph>
          {currentRound} / {gameInfo.totalRound}
        </GameRoundParagraph>
        <PlayerList maxPlayer={10} sizeType="medium" />
      </GameContentBox>
      <GameCenterContentBox>
        <div>
          <Logo height={70} />
        </div>
        <canvas
          ref={downloadCanvasRef}
          width={CANVAS_SIZE.WIDTH}
          height={CANVAS_SIZE.HEIGHT}
          hidden
        />
        <PaintBoard
          headerText={getHeaderElement()}
          centerElement={getCenterElement()}
          footerElement={getFooterElement()}
        />
      </GameCenterContentBox>
      <GameContentBox>
        <HidableBox hide={gameState !== "drawing"}>
          <MoonTimer
            radius={65}
            secondTime={gameState === "drawing" ? roundTime : 0}
            gameState={gameState}
          />
        </HidableBox>
        <Chat />
        <HidableBox hide={!(gameState === "inputKeyword" && isMyTurn)}>
          <Button
            variant="medium-large"
            onClick={onKeywordSubmit}
            disabled={isKeywordEmpty}
          >
            완료
          </Button>
        </HidableBox>
      </GameContentBox>
    </>
  );
};

export default CatchMind;
