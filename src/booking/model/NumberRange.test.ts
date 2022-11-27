import { expect, test, describe } from 'vitest'
import { Range } from "./Range";
import { addMany, subtract } from "./NumberRange";

describe("NumberRange", () => {

  test("should join to single range", () => {
    const ranges: Range<number>[] = [
      Range(0, 1),
      Range(1, 2),
      Range(2, 3)
    ]

    const res = addMany(ranges)

    expect(res).toEqual([Range(0, 3)])
  })

  test("should join to 2 and add third", () => {
    const ranges: Range<number>[] = [
      Range(0, 1),
      Range(1, 2),
      Range(4, 5)
    ]

    const res = addMany(ranges)

    expect(res).toEqual([
      Range(0, 2),
      Range(4, 5)
    ])

  })

  test("subtruct ", () => {
    const range = Range(0, 10)
    const subtruct = Range(-1, 5)

    const res = subtract(range, subtruct)
    expect(res).toEqual([Range(5, 10)])
  })

  test("subtruct 2", () => {
    const range = Range(-1, 10)
    const subtruct = Range(0, 5)

    const res = subtract(range, subtruct)

    expect(res).toEqual([
      { from: -1, to: 0 },
      { from: 5, to: 10 }
    ])
  })

  test("subtruct 3", () => {
    const range = Range(0, 10)
    const subtruct = Range(0, 10)

    const res = subtract(range, subtruct)
    expect(res).toEqual([])

  })

  test("subtruct 4", () => {
    const range = Range(0, 10)
    const subtruct = Range(-10, -1)

    const res = subtract(range, subtruct)
    expect(res).toEqual([range])

  })
})