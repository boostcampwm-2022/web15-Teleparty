import { Timer } from "../entity/catchMind";
import { TimerRepositoryDataPort } from "./timer.repository.port";

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
