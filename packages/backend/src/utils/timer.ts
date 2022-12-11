import { TimerRepositoryDataPort } from "../domains/garticphone/useCases/timer.repository.port";

export class Timer {
  roomId: string;
  timer: NodeJS.Timeout;
  constructor(roomId: string, id: NodeJS.Timeout) {
    this.roomId = roomId;
    this.timer = id;
  }
  cancelTimer() {
    clearTimeout(this.timer);
  }
}

export class TimerRepository implements TimerRepositoryDataPort {
  static timers: Map<string, Timer> = new Map();

  save(id: string, timer: Timer) {
    TimerRepository.timers.set(id, timer);
  }
  findById(id: string) {
    return TimerRepository.timers.get(id);
  }
  delete(id: string) {
    TimerRepository.timers.delete(id);
  }
}
