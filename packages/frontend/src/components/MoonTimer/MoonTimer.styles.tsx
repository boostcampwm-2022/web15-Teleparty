import styled, { css, keyframes } from "styled-components";

interface MoonTimerTimeParagraphProps {
  warning?: boolean;
}

const shake = keyframes`
  0% { transform: skewX(-15deg); }
  5% { transform: skewX(15deg); }
  10% { transform: skewX(-15deg); }
  15% { transform: skewX(15deg); }
  20% { transform: skewX(0deg); }
  100% { transform: skewX(0deg); }  
`;

export const MoonTimerTimeParagraph = styled.p<MoonTimerTimeParagraphProps>`
  font-family: "Dongle", sans-serif;
  font-size: 1rem;
  scale: 4;
  color: ${(props) => props.theme.colors.yellow};

  ${({ warning }) =>
    warning &&
    css`
      color: ${(props) => props.theme.colors.orange};
      animation: ${shake} 2s 5;
    `}
`;

export const MoonTimerCanvas = styled.canvas`
  border-radius: 50%;
  rotate: 45deg;
`;

export const MoonTimerLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${MoonTimerTimeParagraph} {
    margin-top: 25px;
  }
`;
