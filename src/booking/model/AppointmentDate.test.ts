import { assert, expect, test, describe } from 'vitest'
import { AppointmentDate } from './AppointmentDate';
import * as OnlyDate from './OnlyDate';
import { Time } from './Time';
import { Vaction, WorkingDay, DefaultWorkingDay } from './WorkDay';

describe("AppointmentDate", () => {

  test("vaction day sould not return any appointments", () => {
    const now = new Date();
    const from = OnlyDate.fromDate(now);
    const to = OnlyDate.addDays(from, 10)
    const vaction: Vaction = Vaction(from, to)

    const appDate = AppointmentDate.fromWorkDay(vaction, now)

    expect(appDate.time.length).toEqual(0)
  })

  test("2 hour time slot of 30m duration should return 4 appointments", () => {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);

    const working: WorkingDay = {
      ...DefaultWorkingDay,
      dayOfWeek: now.getDay() + 1,
      duration: 30,
      timeRange: {
        from: Time.create(8),
        to: Time.create(10)
      }
    }
    const appDate = AppointmentDate.fromWorkDay(working, now)

    expect(appDate.time.length).toEqual(4)
  })

  test("working day of diffrent day from now should not return appointments", () => {
    const now = new Date();

    const working: WorkingDay = {
      ...DefaultWorkingDay,
      dayOfWeek: now.getDay(),
      duration: 30,
      timeRange: {
        from: Time.create(8),
        to: Time.create(10)
      }
    }

    const appDate = AppointmentDate.fromWorkDay(working, now)

    expect(appDate.time.length).toEqual(0)
  })

  test("should not return appointments if passed time range", () => {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);

    const working: WorkingDay = {
      ...DefaultWorkingDay,
      dayOfWeek: now.getDay() + 1,
      duration: 30,
      timeRange: {
        from: Time.create(8),
        to: Time.create(10)
      }
    }
    const appDate = AppointmentDate.fromWorkDay(working, now)

    expect(appDate.time.length).toEqual(4)
  })
})