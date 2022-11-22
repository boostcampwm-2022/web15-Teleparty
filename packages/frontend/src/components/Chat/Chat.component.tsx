import { useEffect, useRef, useState } from "react";

import { ChatInputForm, ChatLayout } from "./Chat.styles";
import ChatBubble from "./ChatBubble.component";

import { Button } from "../Button/Button.styles";
import Icon from "../Icon/Icon";
import { Input } from "../Input/Input.styles";

interface ChatData {
  username: string;
  message: string;
}

interface ChatProps {
  variant?: "horizontal";
}

const mock = [
  { username: "me", message: "안녕하세요" },
  {
    username: "me",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare mattis orci. Vestibulum sed facilisis dolor.",
  },
  {
    username: "other1",
    message: "안녕하세요. 반갑습니다.",
  },
  {
    username: "other1",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare mattis orci. Vestibulum sed facilisis dolor.",
  },
  {
    username: "other2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare mattis orci. Vestibulum sed facilisis dolor.",
  },
  {
    username: "other2",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare mattis orci. Vestibulum sed facilisis dolor.",
  },
];

const Chat = ({ variant }: ChatProps) => {
  const [chats, setChats] = useState<ChatData[]>(mock);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const onChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInputRef.current || !chatInputRef.current.value) return;

    const newChatData = {
      username: "me",
      message: chatInputRef.current.value,
    };
    setChats((prev) => [...prev, newChatData]);

    // socket emit

    chatInputRef.current.value = "";
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <>
      <ChatLayout variant={variant}>
        {chats.map(({ username, message }, index, messages) => (
          <ChatBubble
            key={index}
            variant={variant}
            isMine={username === "me"}
            isFirst={messages[index - 1]?.username !== username}
            username={username}
          >
            {message}
          </ChatBubble>
        ))}
        <div ref={chatEndRef}></div>
      </ChatLayout>
      <ChatInputForm variant={variant} onSubmit={onChatSubmit}>
        <Input
          variant="medium"
          placeholder="메세지를 입력하세요."
          ref={chatInputRef}
        />
        <Button variant="transparent">
          <Icon size={24} icon="paper-plane" />
        </Button>
      </ChatInputForm>
    </>
  );
};

export default Chat;
