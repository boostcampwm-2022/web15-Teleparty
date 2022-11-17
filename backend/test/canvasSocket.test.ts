import { createServer } from "http";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { Server, Socket } from "socket.io";
import { canvasEventApplyer } from "../src/domains/canvas/canvas";

const testData = {
  id: "adfla",
  color: "string;",
  transparency: 0.7,
  type: "string;",
  lineWidth: 5,
  points: [
    {
      x: 1,
      y: 2,
    },
  ],
};
const pointData = { id: "adfla", point: { x: 1, y: 3 } };

describe("socket.io canvas 이벤트 테스트", () => {
  let io: Server, serverSocket: Socket, clientSocket: ClientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(8000, () => {
      clientSocket = Client(`http://localhost:${8000}`);
      io.on("connection", (socket: Socket) => {
        serverSocket = socket;
        canvasEventApplyer(socket);
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("login 테스트", (done) => {
    clientSocket.emit("login");
    clientSocket.on("login", (data) => {
      expect(data).toHaveLength(0);
      done();
    });
  });

  test("draw-start 테스트", (done) => {
    clientSocket.emit("draw-start", testData);

    clientSocket.on("draw-start", (data) => {
      expect(data).toHaveProperty("id", "adfla");
      expect(data).toHaveProperty("color", "string;");
      expect(data).toHaveProperty("transparency", 0.7);
      expect(data).toHaveProperty("type", "string;");
      expect(data).toHaveProperty("lineWidth", 5);
      expect(data).toHaveProperty("points[0].x", 1);
      expect(data).toHaveProperty("points[0].y", 2);
      done();
    });
  });

  test("drawing-add", (done) => {
    clientSocket.emit("drawing-add", pointData);

    clientSocket.on("drawing-add", (data) => {
      expect(data).toHaveProperty("id", "adfla");
      expect(data).toHaveProperty("point", { x: 1, y: 3 });
      done();
    });
  });

  test("drawing-modify 테스트", (done) => {
    clientSocket.emit("drawing-modify", pointData);

    clientSocket.on("drawing-modify", (data) => {
      expect(data).toHaveProperty("id", "adfla");
      expect(data).toHaveProperty("point", { x: 1, y: 3 });
      done();
    });
  });
});
