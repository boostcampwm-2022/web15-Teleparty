import { Socket } from "socket.io";
import { CavasData } from "../../types/canvasData";

const canvasDatas = new Map();
canvasDatas.set("uu123", {
  color: "string;",
  transparency: 0.7,
  type: "string;",
  lineWidth: 5,
  points: [{ x: 1, y: 2 }],
});

export const canvasEventApplyer = (socket: Socket) => {
  socket.on("login", () => {
    const sendData = [...canvasDatas.entries()];
    socket.emit("login", sendData);
  });

  socket.on("draw-start", (data: CavasData) => {
    const { id, color, transparency, type, lineWidth, points } = data;

    canvasDatas.set(id, {
      color,
      transparency,
      type,
      lineWidth,
      points,
    });

    socket.emit("draw-start", data);
  });

  socket.on("drawing-add", (data) => {
    const { id, point } = data;

    canvasDatas.get(id).points.push(point);
    socket.emit("drawing-add", data);
  });

  socket.on("drawing-modify", (data) => {
    const { id, point } = data;

    const points = canvasDatas.get(id).points;
    points[points.lenght - 1] = point;

    socket.emit("drawing-modify", data);
  });
};
