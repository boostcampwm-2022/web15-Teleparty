import { getCanvasContextSetting, setCanvasContextSetting } from "./canvas";
import { Point } from "./Point";
import Shape from "./Shape";

export default class Line extends Shape {
  protected points: Point[] = [];

  pushPoint(point: Point) {
    this.points.push(point);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const prevCtxSetting = getCanvasContextSetting(ctx);
    setCanvasContextSetting(ctx, {
      strokeStyle: this.color,
      lineWidth: this.lineWidth,
      globalAlpha: this.transparency,
    });

    ctx.beginPath(); 
    for (const { x, y } of this.points) {
      ctx.lineTo(x, y); 
    }
    ctx.stroke(); 

    setCanvasContextSetting(ctx, prevCtxSetting);
  }
}
