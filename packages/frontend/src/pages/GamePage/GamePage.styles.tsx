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
  font-family: "Dongle", sans-serif;
  font-size: 4rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.white};
  transform: scale(1.4);
`;

const GamePageContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const GamePageCenterContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-top: 1rem;
`;

export {
  GamePageLayout,
  GamePageRoundParagraph,
  GamePageContentBox,
  GamePageCenterContentBox,
};
