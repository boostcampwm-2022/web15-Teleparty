import { atomWithReset } from "jotai/utils";

const THICKNESS = {
  X_SMALL: 0.375,
  SMALL: 0.75,
  MEDIUM: 1.125,
  LARGE: 1.5,
  X_LARGE: 1.875,
} as const;

export const THICKNESS_VALUES = Object.values(THICKNESS);

export const thicknessAtom = atomWithReset<number>(THICKNESS.MEDIUM);
