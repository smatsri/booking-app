
export enum AppointmentType {
  Phone = 1,
  Video = 2,
  Clinic = 3,
}

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

export type Range<T> = {
  from: T,
  to: T
}

type CompareFn<T> = (t1: T, t2: T) => number

type BetweenFn<T> = (value: T, range: Partial<Range<T>>) => boolean

export const Between = <T>(compare: CompareFn<T>): BetweenFn<T> => {

  const gtEq = (t1: T, t2: T) => compare(t1, t2) >= 0
  const ltEq = (t1: T, t2: T) => compare(t1, t2) <= 0

  return (value: T, { from, to }: Partial<Range<T>>) => {
    return (!from || gtEq(value, from)) && (!to || ltEq(value, to))
  }

};

export type Time = {
  hours: number
  minutes: number
}

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

export type OnlyDate = {
  year: number
  month: number
  day: number
}

export namespace OnlyDate {

  const MIN_DATE: OnlyDate = {
    year: 0,
    month: 0,
    day: 0
  }

  const MAX_DATE = {
    year: 9999,
    month: 0,
    day: 0
  }

  const getTimestamp = (date: OnlyDate) => {
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
}

export enum WorkingHourType {
  Work = 0,
  Vacation = 1
}

export type WorkingDay = {
  type: WorkingHourType.Work
  dayOfWeek: DayOfTheWeek
  timeRange: Range<Time>
  dateRange?: Partial<Range<OnlyDate>>
  appointmentType: AppointmentType
  clinicId?: string
  duration: number
}

export const DefaultWorkingDay: WorkingDay = {
  type: WorkingHourType.Work,
  appointmentType: AppointmentType.Phone,
  dayOfWeek: DayOfTheWeek.Sunday,
  duration: 0,
  timeRange: { from: Time.create(), to: Time.create() }
}

export type Vaction = {
  type: WorkingHourType.Vacation
  timeRange?: Range<Time>
  dateRange: Range<OnlyDate>
}
export const Vaction = (from: OnlyDate, to: OnlyDate, timeRange?: Range<Time>): Vaction => ({
  type: WorkingHourType.Vacation,
  dateRange: { from, to },
  timeRange
})

export type WorkDay = WorkingDay | Vaction


export namespace WorkDay {

  export const isWorkingDay = (wd: WorkDay): wd is WorkingDay => wd.type === WorkingHourType.Work
  export const isVacation = (wd: WorkDay): wd is Vaction => wd.type === WorkingHourType.Vacation

  export const isWorking = (wh: WorkingDay, date: Date) => {
    const { dayOfWeek, timeRange, dateRange } = wh;
    const d = Time.fromDate(date)
    return (
      dayOfWeek === DayOfTheWeek.fromDate(date)
      && (!dateRange || OnlyDate.between(OnlyDate.fromDate(date), dateRange))
      && Time.gt(timeRange.from, Time.fromDate(date))
    )
  }

  export const isAvailable = (wd: WorkDay, date: Date) => {
    if (isVacation(wd)) {
      return false
    }
    return isWorking(wd, date);
  }

}

export type AppointmentTime = {
  time: Time
  duration: number
  type: AppointmentType
}

export type AppointmentDate = {
  date: OnlyDate;
  time: AppointmentTime[]
}

export namespace AppointmentDate {

  const { isVacation } = WorkDay

  const getFromWorking = (
    { timeRange: { from, to },
      duration,
      appointmentType }: WorkingDay): AppointmentTime[] => {

    return Time
      .split(from, to, duration)
      .map<AppointmentTime>((time) => ({
        duration,
        time,
        type: appointmentType
      }));
  }

  const getTime = (wd: WorkDay, date: Date) => isVacation(wd) || !WorkDay.isAvailable(wd, date) ? [] : getFromWorking(wd);

  export const fromWorkDay = (wd: WorkDay, date: Date): AppointmentDate => {
    return {
      date: OnlyDate.fromDate(date),
      time: getTime(wd, date),
    }
  }

  export const combain =  (w1: WorkDay, wd2: WorkDay, date: Date) => {

  }
}
