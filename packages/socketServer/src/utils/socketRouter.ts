/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io";

interface API {
  apiName: string;
  fn: (...args: any[]) => void;
}

export class SocketRouter {
  #APIs: API[] = [];

  get(apiName: string, fn: (...arg0: any[]) => void) {
    this.#APIs.push({ apiName, fn });
  }

  get router() {
    return (socket: Socket, next: (err?: any) => void) => {
      this.#APIs.forEach((api) =>
        socket.on(api.apiName, (data) =>
          this.errorHandler(api.fn)(socket, data)
        )
      );
      next();
    };
  }

  errorHandler(fn: (...arg0: any[]) => void) {
    return async (socket: Socket, data: any) => {
      try {
        await fn(socket, data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
  }
}
