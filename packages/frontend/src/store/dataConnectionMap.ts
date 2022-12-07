import { atom } from "jotai";
import { DataConnection } from "peerjs";

export const dataConnectionMapAtom = atom<Map<string, DataConnection>>(
  new Map()
);
