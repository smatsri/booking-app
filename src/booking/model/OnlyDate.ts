import { Between } from "./BetweenFn";

export type OnlyDate = {
  year: number;
  month: number;
  day: number;
};



export const MIN_DATE: OnlyDate = {
  year: 0,
  month: 0,
  day: 0
}

export const MAX_DATE = {
  year: 9999,
  month: 0,
  day: 0
}

export const getTimestamp = (date: OnlyDate) => {
  var d = new Date(date.year, date.month - 1, date.day);
  return d.getTime();
}

export const compare = (t1: OnlyDate, t2: OnlyDate): number => {
  const m1 = getTimestamp(t1)
  const m2 = getTimestamp(t2)
  return m1 == m2 ? 0 : m1 > m2 ? 1 : -1;
}

export const between = Between(compare)

export const fromDate = (date: Date): OnlyDate => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate()
})

export const toDate = (date: OnlyDate): Date => new Date(date.year, date.month - 1, date.day);

export const addDays = (t1: OnlyDate, numDays: number): OnlyDate => {
  const date = toDate(t1)
  date.setDate(date.getDate() + numDays)
  return fromDate(date);
}