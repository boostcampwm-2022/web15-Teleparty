import {
  PlayerListItemLayout,
  RightSection,
  LeftSection,
  AvatarContainer,
  Avatar,
  Name,
  Score,
  AudioToggleButton,
} from "./PlayerListItem.styles";

import { colors } from "../../../global-styles/theme";
import { GamePlayer } from "../../../types/game";
import Icon from "../../Icon/Icon";

interface PlayerListItemProps {
  sizeType: "medium" | "large";
  player: GamePlayer;
  isMine: boolean;
}

const PlayerListItem = ({ sizeType, player, isMine }: PlayerListItemProps) => {
  const {
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
        <AudioToggleButton>
          {isMine &&
            (isMicOn ? (
              <Icon icon="mic" size={20} color={colors.primary} />
            ) : (
              <Icon icon="mic-off" size={20} color={colors.primary} />
            ))}
          {!isMine &&
            (isMicOn ? (
              <Icon icon="volume-medium" size={20} color={colors.primary} />
            ) : (
              <Icon icon="volume-mute2" size={20} color={colors.primary} />
            ))}
        </AudioToggleButton>
      </LeftSection>
    </PlayerListItemLayout>
  );
};

export default PlayerListItem;
