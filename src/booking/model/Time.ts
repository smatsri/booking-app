import { Between } from "./BetweenFn";

export type Time = {
  hours: number;
  minutes: number;
};

export namespace Time {

  export const toMinutes = ({ hours, minutes }: Time): number => {
    return minutes + (hours * 60);
  }

  export const fromMinutes = (total: number): Time => {

    let minutes = total % 60;
    let hours = (total - minutes) / 60;
    return {
      hours,
      minutes
    }
  }

  export const compare = (t1: Time, t2: Time): number => {
    const m1 = toMinutes(t1)
    const m2 = toMinutes(t2)
    return m1 == m2 ? 0 : m1 > m2 ? 1 : -1;
  }

  export const gt = (t1: Time, t2: Time): boolean => toMinutes(t1) > toMinutes(t2)

  export const between = Between<Time>(compare)

  export const fromDate = (date: Date): Time => {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes()
    }
  }

  export const create = (hours: number = 0, minutes: number = 0): Time => ({ hours, minutes })

  export const add = (t1: Time, t2: Time): Time => {
    let minutes = toMinutes(t1) + toMinutes(t2)
    return fromMinutes(minutes)
  }

  export const addMinutes = (t: Time, m: number): Time => {
    let minutes = toMinutes(t) + m;
    return fromMinutes(minutes)
  }

  export const split = (from: Time, to: Time, interval: number): Time[] => {

    const res: Time[] = []
    let curMin = toMinutes(from)
    let toMin = toMinutes(to)

    while (curMin < toMin) {
      let t = fromMinutes(curMin)
      res.push(t)
      curMin += interval
    }

    return res;
  }
}

