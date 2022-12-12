import styled from "styled-components";

export const MoonTimerTimeParagraph = styled.p`
  font-family: "Dongle", sans-serif;
  font-size: 1rem;
  scale: 4;
  color: ${(props) => props.theme.colors.yellow};
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
