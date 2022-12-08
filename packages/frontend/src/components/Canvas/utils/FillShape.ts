import { getCanvasContextSetting, setCanvasContextSetting } from "./canvas";
import { floodFill } from "./floodfill";
import { Point } from "./Point";
import Shape from "./Shape";

export default class FillShape extends Shape {
  protected point: Point;

  constructor(
    color: string,
    transparency: number,
    lineWidth: number,
    point: Point
  ) {
    super(color, transparency, lineWidth);
    this.point = {
      x: Math.floor(point.x),
      y: Math.floor(point.y),
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const prevCtxSetting = getCanvasContextSetting(ctx);
    setCanvasContextSetting(ctx, {
      fillStyle: this.color,
      globalAlpha: this.transparency,
    });

    const { x, y } = this.point;
    floodFill(ctx, x, y);

    setCanvasContextSetting(ctx, prevCtxSetting);
  }
}
