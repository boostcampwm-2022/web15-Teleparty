import { Socket } from "socket.io";
import { CanvasData } from "../../types/canvasData";

const canvasDataMap = new Map();

export const canvasEventApplyer = (socket: Socket) => {
  socket.on("login", () => {
    const sendData = [...canvasDataMap.entries()];
    socket.emit("login", sendData);
  });

  socket.on("draw-start", (data: CanvasData) => {
    const { id, color, transparency, type, lineWidth, points } = data;

    canvasDataMap.set(id, {
      color,
      transparency,
      type,
      lineWidth,
      points,
    });

    socket.broadcast.emit("draw-start", data);
  });

  socket.on("drawing-add", (data) => {
    const { id, point } = data;

    const target = canvasDataMap.get(id);
    if (target) {
      target.points.push(point);
      socket.broadcast.emit("drawing-add", data);
    } else {
      socket.emit("error", {
        type: "drawing-add-fail",
        message: "해당하는 id의 객체가 존재하지 않습니다.",
      });
    }
  });

  socket.on("drawing-modify", (data) => {
    const { id, point } = data;

    const points = canvasDataMap.get(id)?.points;
    if (points) {
      points[points.lenght - 1] = point;
      socket.broadcast.emit("drawing-modify", data);
    } else {
      socket.emit("error", {
        type: "drawing-modify-fail",
        message: "해당하는 id의 객체가 존재하지 않습니다.",
      });
    }
  });
};
