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
  children: React.ReactNode;
}

const ChatBubble = ({
  children,
  isFirst,
  isMine,
  username,
}: ChatBubbleProps) => {
  const isNotMyFirstChat = !isMine && isFirst;
  return (
    <ChatRow isMine={isMine}>
      {isNotMyFirstChat && <Avatar variant="small" />}
      <ChatTextLayout isFirst={isFirst}>
        {isNotMyFirstChat && <ChatUsernameText>{username}</ChatUsernameText>}
        <ChatText isMine={isMine} isFirst={isFirst}>
          {children}
        </ChatText>
      </ChatTextLayout>
    </ChatRow>
  );
};

export default ChatBubble;
