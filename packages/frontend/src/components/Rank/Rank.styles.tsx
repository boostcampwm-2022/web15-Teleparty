import styled from "styled-components";

const RankLayout = styled.div`
  width: 1036px;
  height: 644px;
  border: 1px solid ${({ theme: { colors } }) => colors.primary};
  border-radius: 10px;
  background-color: ${({ theme: { colors } }) => colors.primaryLight};
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const RankRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const RankBox = styled.div`
  position: relative;
  display: flex;
  border-radius: 10px;
  color: ${({ theme: { colors } }) => colors.white};
  background-color: ${({ theme: { colors } }) => colors.primary};
  padding: 0.5rem 2.5rem;
  font-size: 42px;
  align-items: center;
  gap: 0.5rem;
`;

const RankNumberBox = styled.div<{ rank: number }>`
  position: absolute;
  left: 0;
  margin-left: -1.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 36px;
  width: 3.5rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  padding: 0.5rem;
  border: 2px solid ${({ theme: { colors } }) => colors.white};
  background-color: ${({ theme: { colors }, rank }) =>
    rank === 1
      ? colors.gold
      : rank === 2
      ? colors.silver
      : rank === 3
      ? colors.bronze
      : colors.primaryLight};
  color: ${({ theme: { colors } }) => colors.white};
`;

const RankNumberText = styled.span`
  font-family: "Dongle", sans-serif;
  transform: translateY(3px);
  scale: 2;
`;

const RankPlayerText = styled.span`
  width: 16rem;
`;

const RankScoreText = styled.span`
  width: 7.5rem;
  text-align: right;
  font-weight: 700;
`;

export {
  RankLayout,
  RankRow,
  RankBox,
  RankNumberBox,
  RankNumberText,
  RankScoreText,
  RankPlayerText,
};
