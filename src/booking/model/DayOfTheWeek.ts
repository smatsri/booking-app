
export enum DayOfTheWeek {
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
  Saturday = 7
}

export namespace DayOfTheWeek {
  export const fromDate = (date: Date) => date.getDay() + 1;
}