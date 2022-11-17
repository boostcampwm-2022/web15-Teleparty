import { Socket } from "socket.io";
import { CavasData } from "../../types/canvasData";

const canvasDatas = new Map();

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

    socket.broadcast.emit("draw-start", data);
  });

  socket.on("drawing-add", (data) => {
    const { id, point } = data;

    const target = canvasDatas.get(id);
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

    const points = canvasDatas.get(id)?.points;
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
