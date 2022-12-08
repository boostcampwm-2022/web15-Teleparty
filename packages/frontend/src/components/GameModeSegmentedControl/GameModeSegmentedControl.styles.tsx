import styled, { css } from "styled-components";

const GAME_MODE_BUTTON_BORDER_WIDTH = "5px";
const GAME_MODE_BUTTON_BORDER_RADIUS = "16px";

interface GameModeButtonLayoutProps {
  selected: boolean;
}

export const GameModeButton = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  position: absolute;
  top: ${"-" + GAME_MODE_BUTTON_BORDER_WIDTH};
  left: ${"-" + GAME_MODE_BUTTON_BORDER_WIDTH};
  width: calc(100% + ${GAME_MODE_BUTTON_BORDER_WIDTH} * 2);
  height: calc(100% + ${GAME_MODE_BUTTON_BORDER_WIDTH} * 2);
  margin: 0;
  border-radius: ${GAME_MODE_BUTTON_BORDER_RADIUS};
  opacity: 0;
  cursor: pointer;
`;

export const GameModeTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
`;

export const GameModeDescriptionParagraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.35rem;
`;

export const GameModeButtonLayout = styled.li<GameModeButtonLayoutProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 100%;
  padding: 25px 50px;
  border: ${GAME_MODE_BUTTON_BORDER_WIDTH} solid
    ${(props) => props.theme.colors.primary};
  border-radius: ${GAME_MODE_BUTTON_BORDER_RADIUS};
  box-shadow: ${(props) => props.theme.shadows.medium};
  color: ${(props) => props.theme.colors.primary};
  background-color: transparent;

  ${(props) =>
    props.selected &&
    css`
      border-color: ${(props) => props.theme.colors.yellow};
      background-color: ${(props) => props.theme.colors.primaryLight};
    `}

  ${GameModeTitle} {
    margin-bottom: 15px;
  }
`;

export const GameModeSegmentedControlLayout = styled.ul`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 912px;
  height: 332px;
  padding: 30px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};
  box-shadow: ${(props) => props.theme.shadows.medium};
`;
