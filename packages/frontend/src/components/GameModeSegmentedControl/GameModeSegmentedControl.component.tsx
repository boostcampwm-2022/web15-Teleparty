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

interface GameModeSegmentedControlProps {
  selectedGameMode: "catchMind" | "garticPhone";
  setSelectedGameMode: React.Dispatch<
    React.SetStateAction<"catchMind" | "garticPhone">
  >;
}

const GameModeSegmentedControl = ({
  selectedGameMode,
  setSelectedGameMode,
}: GameModeSegmentedControlProps) => {
  const onChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedGameMode(e.target.value as GameMode);
  };

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
