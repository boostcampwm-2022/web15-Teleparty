import { useSetAtom } from "jotai";

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
import { voiceInputMediaStream } from "../../../hooks/useAudioCommunication";
import { updatePlayerWithPartialPlayerInfoAtom } from "../../../store/players";
import { GamePlayer } from "../../../types/game";
import { audioStreamManager } from "../../../utils/audioStreamManager";
import Icon from "../../Icon/Icon";

interface PlayerListItemProps {
  sizeType: "medium" | "large";
  player: GamePlayer;
  isMine: boolean;
}

const PlayerListItem = ({ sizeType, player, isMine }: PlayerListItemProps) => {
  const updatePlayerWithPartialPlayerInfo = useSetAtom(
    updatePlayerWithPartialPlayerInfoAtom
  );
  const {
    peerId,
    userName,
    avatarURL,
    isHost,
    isMicOn,
    isCurrentTurn,
    isReady,
    score,
    isAudioDetected,
    isGameQuit,
  } = player;
  const playerState = isReady
    ? "ready"
    : isCurrentTurn
    ? "turn"
    : isGameQuit
    ? "quit"
    : "normal";

  const toggleAudio = () => {
    const setAudioStateChangedPlayer = (
      playerId: string,
      audioState: boolean
    ) => {
      updatePlayerWithPartialPlayerInfo({
        playerId,
        partialPlayerInfo: {
          isAudioDetected: audioState,
        },
      });
    };

    // toggle my mic
    if (isMine) {
      if (!voiceInputMediaStream) return;
      voiceInputMediaStream.getAudioTracks()[0].enabled =
        !voiceInputMediaStream.getAudioTracks()[0].enabled;
      setAudioStateChangedPlayer(
        peerId,
        voiceInputMediaStream.getAudioTracks()[0].enabled
      );
      return;
    }

    // toggle peer's audio
    audioStreamManager.toggleMute(peerId);
    setAudioStateChangedPlayer(peerId, audioStreamManager.getMute(peerId));
  };

  return (
    <PlayerListItemLayout sizeType={sizeType} state={playerState}>
      <RightSection>
        <AvatarContainer spotlight={isAudioDetected}>
          {isHost && <Icon icon="crown" size={20} color={colors.primary} />}
          {avatarURL && <Avatar src={avatarURL} />}
        </AvatarContainer>
        <Name>{userName}</Name>
      </RightSection>
      <LeftSection>
        {score !== undefined && <Score>{score}점</Score>}
        <AudioToggleButton onClick={toggleAudio}>
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
