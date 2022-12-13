import { Timer } from "../../../utils/timer";

export interface TimerRepositoryDataPort {
  save: (roomId: string, timer: Timer) => void;
  findById: (id: string) => Timer | undefined;
  delete: (id: string) => void;
}
