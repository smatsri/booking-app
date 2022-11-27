import { assert, expect, test, describe } from 'vitest'
import { Time } from "./Time"

describe("Time.split", () => {
  test('should split ', () => {
    const from = Time.fromMinutes(0)
    const to = Time.fromMinutes(120)
    const duration = 30
    const parts = Time.split(from, to, duration)

    expect(parts.length).eq(4)
  })
})