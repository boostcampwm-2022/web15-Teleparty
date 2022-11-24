import { useAtom } from "jotai";

import {
  GamePageContentBox,
  GamePageRoundParagraph,
  GamePageLayout,
} from "./GamePage.styles";

import Chat from "../../components/Chat/Chat.component";
import { Button } from "../../components/common/Button";
import { Logo } from "../../components/Logo/Logo.component";
import MoonTimer from "../../components/MoonTimer/MoonTimer.component";
import PaintBoard from "../../components/PaintBoard/PaintBoard.component";
import PlayerList from "../../components/PlayerList/PlayerList.component";
import { gameInfoAtom } from "../../store/game";
import { playersAtom } from "../../store/players";

const GamePage = () => {
  const [players, setPlayers] = useAtom(playersAtom);
  const [gameInfo, setGameInfo] = useAtom(gameInfoAtom);

  return (
    <GamePageLayout>
      <GamePageContentBox>
        <GamePageRoundParagraph>1 / 9</GamePageRoundParagraph>
        <PlayerList maxPlayer={10} players={players} sizeType="medium" />
      </GamePageContentBox>
      <GamePageContentBox>
        <Logo />
        <PaintBoard />
      </GamePageContentBox>
      <GamePageContentBox>
        <MoonTimer radius={50} secondTime={60} />
        <Chat />
        <Button variant="large">완료</Button>
      </GamePageContentBox>
    </GamePageLayout>
  );
};

export default GamePage;
