export interface Subject {
  id: string;
  name: string;
  weight: number;
}

export interface Availability {
  [day: string]: string[]; // ex: { monday: ["09:00-10:00", ...], ... }
}

export interface GeneratedSchedule {
  [day: string]: {
    [timeSlot: string]: string; // ex: { "09:00-10:00": "Math" }
  };
}