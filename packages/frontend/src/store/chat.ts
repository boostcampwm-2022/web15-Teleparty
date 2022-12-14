import { atom } from "jotai";

export interface ChatData {
  id: string;
  message: string;
  avatarURL: string;
  username: string;
}

export const chatAtom = atom<ChatData[]>([]);
