import { useEffect, useRef, useCallback } from "react";

import { useAtom, useAtomValue } from "jotai";

import { ChatInputForm, ChatLayout } from "./Chat.styles";
import ChatBubble from "./ChatBubble.component";

import { chatAtom, ChatData } from "../../store/chat";
import { playersAtom, getPlayerNameById } from "../../store/players";
import { socketAtom } from "../../store/socket";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import Icon from "../Icon/Icon";

interface ChatProps {
  variant?: "horizontal";
}

const Chat = ({ variant }: ChatProps) => {
  const [chats, setChats] = useAtom(chatAtom);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const socket = useAtomValue(socketAtom);
  const players = useAtomValue(playersAtom);

  const getUserNameById = useCallback(
    (id: string) => players.find(({ peerId }) => peerId === id)?.userName ?? "",
    [players]
  );
  const getAvatarURLById = useCallback(
    (id: string) =>
      players.find(({ peerId }) => peerId === id)?.avatarURL ?? "",
    [players]
  );

  const onChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInputRef.current || !chatInputRef.current.value) return;
    const trimmedText = chatInputRef.current.value.trim();
    if (!trimmedText) return;

    const newChat = {
      id: socket.id,
      message: chatInputRef.current.value,
      username: getUserNameById(socket.id),
      avatarURL: getAvatarURLById(socket.id),
    };

    // socket emit
    socket.emit("chatting", newChat);
    setChats((prev) => [...prev, newChat]);

    chatInputRef.current.value = "";
  };

  useEffect(() => {
    const chatListener = (newChat: ChatData) => {
      const { id } = newChat;
      const chat = {
        ...newChat,
        username: getUserNameById(id),
        avatarURL: getAvatarURLById(id),
      };
      setChats((prev) => [...prev, chat]);
    };
    socket.on("chatting", chatListener);
    return () => {
      socket.off("chatting", chatListener);
    };
  }, [socket, setChats, getUserNameById, getAvatarURLById]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [chats]);

  return (
    <div>
      <ChatLayout variant={variant}>
        {chats.map(({ id, message, avatarURL, username }, index, messages) => (
          <ChatBubble
            key={index}
            variant={variant}
            isRightSide={id === socket.id}
            isFirst={messages[index - 1]?.id !== id}
            username={username}
            avatarURL={avatarURL}
          >
            {message}
          </ChatBubble>
        ))}
        <div ref={chatEndRef}></div>
      </ChatLayout>
      <ChatInputForm variant={variant} onSubmit={onChatSubmit}>
        <Input
          variant="medium"
          placeholder="???????????? ???????????????."
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
