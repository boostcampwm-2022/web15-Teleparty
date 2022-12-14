import { useAtom } from "jotai";

import {
  AvatarChangerLayout,
  AvatarChangerButton,
} from "./AvatarChanger.styles";

import { colors } from "../../global-styles/theme";
import { avatarUrlAtom } from "../../store/avatarUrl";
import { createDiceBearApiUrl } from "../../utils/dicebearApi";
import { Avatar } from "../Avatar/Avatar.styles";
import Icon from "../Icon/Icon";

const AvatarChanger = () => {
  const [avatarUrl, setAvatarUrl] = useAtom(avatarUrlAtom);

  const avatarChangerButtonClickHandler = () => {
    setAvatarUrl(createDiceBearApiUrl("adventurer", Math.random().toString()));
  };

  return (
    <AvatarChangerLayout>
      <Avatar variant="large" src={avatarUrl} />
      <AvatarChangerButton onClick={avatarChangerButtonClickHandler}>
        <Icon icon="refresh-cw" size={28} color={colors.primary} />
      </AvatarChangerButton>
    </AvatarChangerLayout>
  );
};

export default AvatarChanger;
