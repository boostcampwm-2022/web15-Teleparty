import { atom } from "jotai";

import { createDiceBearApiUrl } from "../utils/dicebearApi";

export const avatarUrlAtom = atom(
  createDiceBearApiUrl("adventurer", Math.random().toString())
);
