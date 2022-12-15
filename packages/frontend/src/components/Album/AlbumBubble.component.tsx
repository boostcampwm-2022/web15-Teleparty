import { AlbumText } from "./Album.styles";

import { Avatar } from "../Avatar/Avatar.styles";
import { ChatRow, ChatTextLayout, ChatUsernameText } from "../Chat/Chat.styles";

interface AlbumBubbleProps {
  username: string;
  isRightSide: boolean;
  avatarURL: string;
  children: React.ReactNode;
}

const AlbumBubble = ({
  children,
  isRightSide,
  username,
  avatarURL,
}: AlbumBubbleProps) => {
  return (
    <ChatRow isRightSide={isRightSide}>
      <Avatar variant="small" src={avatarURL} />
      <ChatTextLayout isFirst>
        <ChatUsernameText>{username}</ChatUsernameText>
        <AlbumText isRightSide={isRightSide}>{children}</AlbumText>
      </ChatTextLayout>
    </ChatRow>
  );
};

export default AlbumBubble;
