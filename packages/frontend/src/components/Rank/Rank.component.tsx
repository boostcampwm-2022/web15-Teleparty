import {
  RankBox,
  RankLayout,
  RankNumberBox,
  RankPlayerText,
  RankRow,
  RankScoreText,
  RankNumberText,
} from "./Rank.styles";

import { Avatar } from "../Avatar/Avatar.styles";

interface RankProps {
  rankList: {
    userName: string;
    score: number;
    avatarURL: string;
  }[];
}

const Rank = ({ rankList }: RankProps) => {
  return (
    <RankLayout>
      {rankList.map(({ userName, score, avatarURL }, index) => (
        <RankRow key={index}>
          <RankBox>
            <RankNumberBox rank={index + 1}>
              <RankNumberText>{index + 1}</RankNumberText>
            </RankNumberBox>
            <Avatar variant="medium" src={avatarURL} />
            <RankPlayerText>{userName}</RankPlayerText>
            <RankScoreText>{`${score}점`}</RankScoreText>
          </RankBox>
        </RankRow>
      ))}
    </RankLayout>
  );
};

export default Rank;
