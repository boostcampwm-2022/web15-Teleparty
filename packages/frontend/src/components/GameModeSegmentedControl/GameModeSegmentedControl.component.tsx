import { useEffect } from "react";

import { useAtomValue } from "jotai";

import {
  GameModeSegmentedControlLayout,
  GameModeButtonLayout,
  GameModeButton,
  GameModeTitle,
  GameModeDescriptionParagraph,
} from "./GameModeSegmentedControl.styles";

import {
  GAME_MODE_LIST,
  GameMode,
  GAME_MODE_TITLE_MAP,
  GAME_MODE_DESCRIPTION_MAP,
} from "../../constants/game-mode";
import { socketAtom } from "../../store/socket";

interface GameModeSegmentedControlProps {
  selectedGameMode: GameMode;
  setSelectedGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  disabled: boolean;
}

const GameModeSegmentedControl = ({
  selectedGameMode,
  setSelectedGameMode,
  disabled,
}: GameModeSegmentedControlProps) => {
  const socket = useAtomValue(socketAtom);
  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;
    setSelectedGameMode(e.target.value as GameMode);
    socket.emit("mode-change", { gameMode: e.target.value });
  };

  useEffect(() => {
    const modeChangeListener = ({ gameMode }: { gameMode: GameMode }) => {
      setSelectedGameMode(gameMode);
    };
    socket.on("mode-change", modeChangeListener);
    return () => {
      socket.off("mode-change", modeChangeListener);
    };
  }, [socket, setSelectedGameMode]);

  return (
    <GameModeSegmentedControlLayout>
      {GAME_MODE_LIST.map((gameMode) => (
        <GameModeButtonLayout
          key={gameMode}
          selected={gameMode === selectedGameMode}
        >
          <GameModeButton
            type="radio"
            value={gameMode}
            name="game-mode"
            onChange={onChangeHandler}
            disabled={disabled}
          />
          <GameModeTitle>{GAME_MODE_TITLE_MAP[gameMode]}</GameModeTitle>
          <GameModeDescriptionParagraph>
            {GAME_MODE_DESCRIPTION_MAP[gameMode]}
          </GameModeDescriptionParagraph>
        </GameModeButtonLayout>
      ))}
    </GameModeSegmentedControlLayout>
  );
};

export default GameModeSegmentedControl;
