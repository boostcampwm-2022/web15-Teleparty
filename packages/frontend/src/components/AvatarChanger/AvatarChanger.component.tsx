import {
  AvatarChangerLayout,
  AvatarChangerButton,
} from "./AvatarChanger.styles";

import { colors } from "../../global-styles/theme";
import { Avatar } from "../Avatar/Avatar.styles";
import Icon from "../Icon/Icon";

const AvatarChanger = () => {
  return (
    <AvatarChangerLayout>
      <Avatar
        variant="large"
        src="https://avatars.dicebear.com/api/adventurer/seed.svg"
      />
      <AvatarChangerButton>
        <Icon icon="refresh-cw" size={28} color={colors.primary} />
      </AvatarChangerButton>
    </AvatarChangerLayout>
  );
};

export default AvatarChanger;
