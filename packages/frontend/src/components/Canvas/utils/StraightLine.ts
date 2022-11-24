import { getCanvasContextSetting, setCanvasContextSetting } from "./canvas";
import { Point } from "./Point";
import Shape from "./Shape";

export default class straightLine extends Shape {
  public point1: Point;
  public point2: Point;

  constructor(
    color: string,
    transparency: number,
    lineWidth: number,
    startPoint: Point
  ) {
    super(color, transparency, lineWidth);
    this.point1 = { ...startPoint };
    this.point2 = { ...startPoint };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const prevCtxSetting = getCanvasContextSetting(ctx);
    setCanvasContextSetting(ctx, {
      strokeStyle: this.color,
      lineWidth: this.lineWidth,
      globalAlpha: this.transparency,
    });

    ctx.beginPath();
    ctx.moveTo(this.point1.x, this.point1.y);
    ctx.lineTo(this.point2.x, this.point2.y);
    ctx.stroke();

    setCanvasContextSetting(ctx, prevCtxSetting);
  }
}
