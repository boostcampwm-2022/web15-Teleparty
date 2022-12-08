import styled from "styled-components";

const GameLayout = styled.main<{ ratio: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  height: 100vh;
  transform: scale(${({ ratio }) => ratio});
`;

const GameRoundParagraph = styled.p`
  font-family: "Dongle", sans-serif;
  font-size: 4rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
  transform: scale(1.4);
`;

const GameContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const GameCenterContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-top: 1rem;
`;

export { GameLayout, GameRoundParagraph, GameContentBox, GameCenterContentBox };
