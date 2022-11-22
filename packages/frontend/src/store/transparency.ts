import { atom } from "jotai";

const TRANS_PARENCY_INIT_VALUE = 1;

export const transparencyAtom = atom<number>(TRANS_PARENCY_INIT_VALUE);
