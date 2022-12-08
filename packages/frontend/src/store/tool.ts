import { atom } from "jotai";

// ToolBox 컴포넌트 렌더링에 사용
export const TOOL_TYPES = [
  "pen",
  "fill",
  "circle",
  "erase",
  "straightLine",
  "rectangle",
] as const;

export const PALETTE_COLORS = [
  "black",
  "white",
  "red",
  "pink",
  "orange",
  "yellow-palette",
  "green-palette",
  "blue",
  "indigo",
  "violet",
] as const;

type ToolTypesTuple = typeof TOOL_TYPES;
export type Tool = ToolTypesTuple[number];

export const toolAtom = atom<Tool>("pen");
export const paletteAtom = atom<string>("pink");
