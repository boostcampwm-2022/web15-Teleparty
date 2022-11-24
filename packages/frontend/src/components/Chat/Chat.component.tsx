import { useEffect, useRef, useState } from "react";

import { useAtomValue } from "jotai";

import { ChatInputForm, ChatLayout } from "./Chat.styles";
import ChatBubble from "./ChatBubble.component";

import { socketAtom } from "../../store/socket";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import Icon from "../Icon/Icon";

interface ChatData {
  peerId: string;
  message: string;
}

interface ChatProps {
  variant?: "horizontal";
}

const Chat = ({ variant }: ChatProps) => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const socket = useAtomValue(socketAtom);

  const onChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInputRef.current || !chatInputRef.current.value) return;

    const newChat = {
      message: chatInputRef.current.value,
    };

    // socket emit
    socket.emit("chatting", newChat);

    chatInputRef.current.value = "";
  };

  useEffect(() => {
    const chatListener = (newChat: ChatData) => {
      setChats((prev) => [...prev, newChat]);
    };
    socket.on("chatting", chatListener);
    return () => {
      socket.off("chatting", chatListener);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div>
      <ChatLayout variant={variant}>
        {chats.map(({ peerId, message }, index, messages) => (
          <ChatBubble
            key={index}
            variant={variant}
            isMine={peerId === socket.id}
            isFirst={messages[index - 1]?.peerId !== peerId}
            username={peerId} // user list 추가되면 변경 필요
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
    </div>
  );
};

export default Chat;
