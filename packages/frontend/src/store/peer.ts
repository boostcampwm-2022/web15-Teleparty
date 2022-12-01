import { atom } from "jotai";
import { Peer } from "peerjs";

export const peerAtom = atom<Peer | null>(null);
