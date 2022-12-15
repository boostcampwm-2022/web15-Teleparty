import {
  ChatRow,
  ChatText,
  ChatTextLayout,
  ChatTextProps,
  ChatUsernameText,
} from "./Chat.styles";

import { Avatar } from "../Avatar/Avatar.styles";

interface ChatBubbleProps extends ChatTextProps {
  username?: string;
  avatarURL: string;
  children: React.ReactNode;
}

const ChatBubble = ({
  children,
  isFirst,
  isRightSide,
  username,
  variant,
  avatarURL,
}: ChatBubbleProps) => {
  const isNotMyFirstChat = !isRightSide && isFirst;
  return (
    <ChatRow isRightSide={isRightSide}>
      {isNotMyFirstChat && <Avatar variant="small" src={avatarURL} />}
      <ChatTextLayout isFirst={isFirst}>
        {isNotMyFirstChat && <ChatUsernameText>{username}</ChatUsernameText>}
        <ChatText variant={variant} isRightSide={isRightSide} isFirst={isFirst}>
          {children}
        </ChatText>
      </ChatTextLayout>
    </ChatRow>
  );
};

export default ChatBubble;
