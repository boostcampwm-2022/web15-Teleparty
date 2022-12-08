import { atom } from "jotai";

const DEFAULT_RATIO = 1;

export const ratioAtom = atom<number>(DEFAULT_RATIO);
