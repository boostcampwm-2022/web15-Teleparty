import styled from "styled-components";

const GamePageLayout = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  height: 100vh;
  ${(props) => props.theme.backgrounds.nightCity}
`;

const GamePageRoundParagraph = styled.p`
  font-family: "PoetsenOne", sans-serif;
  font-size: 4rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
`;

const GamePageContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

export { GamePageLayout, GamePageRoundParagraph, GamePageContentBox };
