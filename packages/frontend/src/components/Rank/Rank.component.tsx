import {
  RankBox,
  RankLayout,
  RankNumberBox,
  RankPlayerText,
  RankRow,
  RankScoreText,
} from "./Rank.styles";

import { Avatar } from "../Avatar/Avatar.styles";

interface RankProps {
  rankList: {
    userName: string;
    score: number;
  }[];
}

const Rank = ({ rankList }: RankProps) => {
  return (
    <RankLayout>
      {rankList.map(({ userName, score }, index) => (
        <RankRow key={index}>
          <RankBox>
            <RankNumberBox>{index + 1}</RankNumberBox>
            <Avatar variant="medium" />
            <RankPlayerText>{userName}</RankPlayerText>
            <RankScoreText>{`${score}점`}</RankScoreText>
          </RankBox>
        </RankRow>
      ))}
    </RankLayout>
  );
};

export default Rank;
