// import { SocketEventEmitter } from "../../utils/socketEventEmitter";
import { WebSocket } from "ws";

// const canvasEventEmitter = new SocketEventEmitter();

// canvasEventEmitter.addEventListner("hello", (socket: WebSocket) => {
//   return (data: object) => {
//     socket.emit("bye", "bye");
//     return;
//   };
// });

// export const canvasEventApplyer = canvasEventEmitter.getEventApplyer();

export function canvasEventApplyer(socket: WebSocket) {
  socket.on("hello", (data) => {
    socket.emit("bye", "bye");
  });
}
