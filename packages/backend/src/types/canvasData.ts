type Coordinate = {
  x: number;
  y: number;
};

export interface CanvasData {
  id: string;
  color: string;
  transparency: number;
  type: string;
  lineWidth: number;
  points: Coordinate[];
}

export interface NewCanvasData {
  id: string;
  point: Coordinate;
}
