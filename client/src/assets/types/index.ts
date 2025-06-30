export interface Subject {
  id: string;
  name: string;
  weight: number;
  color: string;
}

export interface ScheduleBlock {
  name: string;
  color: string;
}

export interface Availability {
  [day: string]: string[]; // ex: { monday: ["09:00-10:00", ...], ... }
}

export interface GeneratedSchedule {
  [day: string]: {
    [timeSlot: string]: ScheduleBlock; // ex: { "09:00-10:00": "Math" }
  };
}