import { atom } from "jotai";

export interface ChatData {
  id: string;
  message: string;
}

export const chatAtom = atom<ChatData[]>([]);
