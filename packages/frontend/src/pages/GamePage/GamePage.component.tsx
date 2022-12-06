import { useNavigate } from "react-router-dom";

import { useAtomValue } from "jotai";

import { GamePageLayout } from "./GamePage.styles";

import CatchMind from "../../components/CatchMind/CatchMind.component";
import Gartic from "../../components/Gartic/Gartic.component";
import usePreventClose from "../../hooks/usePreventClose";
import { gameInfoAtom } from "../../store/game";

const GamePage = () => {
  const gameInfo = useAtomValue(gameInfoAtom);
  const navigate = useNavigate();
  usePreventClose();

  return (
    <GamePageLayout>
      {gameInfo.gameMode === "CatchMind" ? <CatchMind /> : <Gartic />}
    </GamePageLayout>
  );
};

export default GamePage;
