import { assert, expect, test, describe } from 'vitest'
import { Time, AppointmentDate, Vaction, WorkingDay, OnlyDate, AppointmentType, DayOfTheWeek, DefaultWorkingDay, CompareFn, Range, NumberRange } from "./availability";


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
      Range(0, 1),
      Range(1, 2),
      Range(2, 3)
    ]

    const res = NumberRange.joinMany(ranges)

    expect(res).toEqual([Range(0, 3)])
  })

  test("should join to 2 and add third", () => {
    const ranges: Range<number>[] = [
      Range(0, 1),
      Range(1, 2),
      Range(4, 5)
    ]

    const res = NumberRange.joinMany(ranges)

    expect(res).toEqual([
      Range(0, 2),
      Range(4, 5)
    ])

  })

  test("subtruct ", () => {
    const range = Range(0, 10)
    const subtruct = Range(-1, 5)

    const res = NumberRange.subtract(range, subtruct)
    expect(res).toEqual([Range(5, 10)])
  })

  test("subtruct 2", () => {
    const range = Range(-1, 10)
    const subtruct = Range(0, 5)

    const res = NumberRange.subtract(range, subtruct)

    expect(res).toEqual([
      { from: -1, to: 0 },
      { from: 5, to: 10 }
    ])
  })

  test("subtruct 3", () => {
    const range = Range(0, 10)
    const subtruct = Range(0, 10)

    const res = NumberRange.subtract(range, subtruct)
    expect(res).toEqual([])
    
  })

  test("subtruct 4", () => {
    const range = Range(0, 10)
    const subtruct = Range(-10, -1)

    const res = NumberRange.subtract(range, subtruct)
    expect(res).toEqual([range])
    
  })
})