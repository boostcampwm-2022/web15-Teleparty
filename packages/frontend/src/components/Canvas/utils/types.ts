import { Point } from "./Point";

import { Tool } from "../../../store/tool";

export type CanvasEventType =
  | "canvas:draw-start"
  | "canvas:draw"
  | "canvas:draw-end"
  | "canvas:undo";

export interface DrawStartParameter {
  point: Point;
  tool: Tool;
  color: string;
  transparency: number;
  lineWidth: number;
}

export interface DrawParameter {
  point: Point;
}

export interface CanvasEvent {
  event: CanvasEventType;
  data: DrawStartParameter | DrawParameter;
}
