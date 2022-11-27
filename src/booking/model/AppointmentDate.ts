import * as D from "./OnlyDate";
import { Time } from "./Time";
import { AppointmentType, WorkDay, WorkingDay } from "./WorkDay";


export type AppointmentDate = {
  date: D.OnlyDate;
  time: AppointmentTime[];
};
export type AppointmentTime = {
  time: Time
  duration: number
  type: AppointmentType
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
      date: D.fromDate(date),
      time: getTime(wd, date),
    }
  }
}