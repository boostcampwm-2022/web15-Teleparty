import { getCanvasContextSetting, setCanvasContextSetting } from "./canvas";
import { Point } from "./Point";
import Shape from "./Shape";

export default class Polygon extends Shape {
  protected points: Point[] = [];

  constructor(
    color: string,
    transparency: number,
    lineWidth: number,
    points: Point[]
  ) {
    super(color, transparency, lineWidth);
    this.points = [...points];
  }

  draw(ctx: CanvasRenderingContext2D) {
    const prevCtxSetting = getCanvasContextSetting(ctx);
    setCanvasContextSetting(ctx, {
      fillStyle: this.color,
      lineWidth: this.lineWidth,
      globalAlpha: this.transparency,
    });

    const startPoint = this.points[0];

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y);
    
    }
    ctx.fill();

    setCanvasContextSetting(ctx, prevCtxSetting);
  }
}
