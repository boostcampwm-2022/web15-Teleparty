import { useAtomValue } from "jotai";

import useGartic from "../../hooks/useGartic";
import {
  GamePageContentBox,
  GamePageRoundParagraph,
} from "../../pages/GamePage/GamePage.styles";
import { gameInfoAtom } from "../../store/game";
import Chat from "../Chat/Chat.component";
import { Button } from "../common/Button";
import { Logo } from "../Logo/Logo.component";
import MoonTimer from "../MoonTimer/MoonTimer.component";
import PaintBoard from "../PaintBoard/PaintBoard.component";
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

  const headerElementMap = {
    gameStart: "",
    drawing: "",
    inputKeyword: "",
    gameEnd: "",
  };
  const centerElementMap = {
    gameStart: null,
    drawing: null,
    inputKeyword: null,
    gameEnd: null,
  };
  const footerElementMap = {
    gameStart: null,
    drawing: null,
    inputKeyword: null,
    gameEnd: null,
  };

  return gameState !== "gameEnd" ? (
    <>
      <GamePageContentBox>
        <GamePageRoundParagraph>
          {currentRound} / {gameInfo.totalRound}
        </GamePageRoundParagraph>
        <PlayerList
          maxPlayer={10}
          players={garticPlayerList}
          sizeType="medium"
        />
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
        <Button variant="large">완료</Button>
      </GamePageContentBox>
    </>
  ) : null;
};

export default Gartic;
