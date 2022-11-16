import { generateUUID } from "../../../utils/uid";

export abstract class Shape {
  // 소켓 통신시 식별을 위해 uid 필요
  private _id = generateUUID();
  protected color = "#000000";
  protected transparency = 1;

  constructor(color: string, transparency: number) {
    this.color = color;
    this.transparency = transparency;
  }

  get id() {
    return this._id;
  }

  /**
   * Canvas context를 받아 해당 context에 Shape를 그립니다.
   */
  abstract draw(ctx: CanvasRenderingContext2D): void;
}
