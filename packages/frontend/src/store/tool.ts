import { atomWithReset } from "jotai/utils";
// ToolBox 컴포넌트 렌더링에 사용
export const TOOL_TYPES = [
  "pen",
  "fill",
  "circle",
  "erase",
  "straightLine",
  "rectangle",
] as const;

type ToolTypesTuple = typeof TOOL_TYPES;
export type Tool = ToolTypesTuple[number];

export const toolAtom = atomWithReset<Tool>("pen");
export const paletteAtom = atomWithReset<string>("#000000");
