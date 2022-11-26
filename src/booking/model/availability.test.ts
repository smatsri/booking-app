import { assert, expect, test, describe } from 'vitest'
import { Time, AppointmentDate, Vaction, WorkingDay, WorkingHourType, OnlyDate, AppointmentType, DayOfTheWeek, DefaultWorkingDay, CompareFn, Range, NumberRange } from "./availability";


describe("Time.split", () => {
  test('should split ', () => {
    const from = Time.fromMinutes(0)
    const to = Time.fromMinutes(120)
    const duration = 30
    const parts = Time.split(from, to, duration)

    expect(parts.length).eq(4)
  })
})


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



describe("NumberRange", () => {


  test("should join to single range", () => {
    const ranges: Range<number>[] = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 }
    ]

    const res = NumberRange.reduce(ranges)

    expect(res.length).toEqual(1)
    expect(res[0]).toEqual({from: 0, to: 3})
  
  })

  test("should join to 2 and add third", () => {
    const ranges: Range<number>[] = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 4, to: 5 }
    ]

    const res = NumberRange.reduce(ranges)

    expect(res.length).toEqual(2)
    expect(res[0]).toEqual({from: 0, to: 2})
    expect(res[1]).toEqual({from: 4, to: 5})
  
  })
})