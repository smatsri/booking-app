import { DayOfTheWeek } from "./DayOfTheWeek"
import { OnlyDate } from "./OnlyDate"
import { Time } from "./Time"
import { Range } from "./Range"

export enum AppointmentType {
  Phone = 1,
  Video = 2,
  Clinic = 3,
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

export namespace WorkDay {

  export const isWorkingDay = (wd: WorkDay): wd is WorkingDay => wd.type === WorkingHourType.Work
  export const isVacation = (wd: WorkDay): wd is Vaction => wd.type === WorkingHourType.Vacation

  export const isWorking = (wh: WorkingDay, date: Date) => {
    const { dayOfWeek, timeRange, dateRange } = wh;
    return (
      dayOfWeek === DayOfTheWeek.fromDate(date)
      && (!dateRange || OnlyDate.between(OnlyDate.fromDate(date), dateRange))
      && Time.gt(timeRange.to, Time.fromDate(date))
    )
  }

  export const isAvailable = (wd: WorkDay, date: Date) => {
    if (isVacation(wd)) {
      return false
    }
    return isWorking(wd, date);
  }

}
export type WorkDay = WorkingDay | Vaction;
