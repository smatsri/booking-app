import { assert, expect, test, describe } from 'vitest'
import { fromMinutes, split } from "./Time"

describe("Time.split", () => {
  test('should split ', () => {
    const from = fromMinutes(0)
    const to = fromMinutes(120)
    const duration = 30
    const parts = split(from, to, duration)

    expect(parts.length).eq(4)
  })
})