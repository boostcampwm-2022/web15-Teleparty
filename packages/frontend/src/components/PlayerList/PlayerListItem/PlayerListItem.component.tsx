import React from "react";

import {
  PlayerListItemLayout,
  RightSection,
  LeftSection,
  AvatarContainer,
  Avatar,
  Name,
  Score,
  IconConatiner,
} from "./PlayerListItem.styles";

import { GamePlayer } from "../../../types/game";
import Icon from "../../Icon/Icon";

interface PlayerListItemProps {
  sizeType: "medium" | "large";
  player: GamePlayer;
}

const PlayerListItem = ({ sizeType, player }: PlayerListItemProps) => {
  const {
    peerId,
    userName,
    avatarURL,
    isHost,
    isMicOn,
    isCurrentTurn,
    isReady,
    score,
  } = player;
  const playerState = isReady ? "ready" : isCurrentTurn ? "turn" : "normal";

  return (
    <PlayerListItemLayout sizeType={sizeType} state={playerState}>
      <RightSection>
        <AvatarContainer>
          {isHost && <Icon icon="check" size={20} />}
          {avatarURL && <Avatar src={avatarURL} />}
        </AvatarContainer>
        <Name>{userName}</Name>
      </RightSection>
      <LeftSection>
        {score !== undefined && <Score>{score}점</Score>}
        <IconConatiner>
          <Icon icon="mic-off" size={20} />
        </IconConatiner>
      </LeftSection>
    </PlayerListItemLayout>
  );
};

export default PlayerListItem;
