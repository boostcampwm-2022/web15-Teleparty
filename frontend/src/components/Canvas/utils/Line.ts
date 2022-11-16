import { Point } from "./Point";
import Shape from "./Shape";

interface ILine {
  start: Point;
  end: Point;
}

export default class Line extends Shape {
  protected lines: ILine[] = [];

  pushLine(line: ILine) {
    this.lines.push(line);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath(); 
    for (const { start, end } of this.lines) {
      ctx.moveTo(start.x, start.y); 
      ctx.lineTo(end.x, end.y); 
    }
    ctx.stroke(); 
  }
}
