import { Timer } from "../entity/catchMind";

export interface TimerRepositoryDataPort {
  save: (roomId: string, timer: Timer) => void;
  findById: (id: string) => Timer | undefined;
  delete: (id: string) => void;
}
