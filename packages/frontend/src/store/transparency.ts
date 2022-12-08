import { atomWithReset } from "jotai/utils";

const TRANS_PARENCY_INIT_VALUE = 1;

export const transparencyAtom = atomWithReset<number>(TRANS_PARENCY_INIT_VALUE);
