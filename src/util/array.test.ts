import { describe, expect, it, vi } from 'vitest'
import { repeat, shuffle } from './array'

describe('shuffle', () => {
  it('contains same items as the input', () => {
    const data = [1, 2, 3, 4, 5]

    const shuffled = [...data]
    shuffle(shuffled)

    expect(shuffled.length).toBe(5)

    shuffled.sort((a, b) => a - b)
    expect(shuffled).toEqual(data)
  })
})

describe('repeat', () => {
  it('generates an array of proper length', () => {
    const data = repeat(20, _ => true)
    expect(data.length).toBe(20)
  })

  it('invokes the callback for each item', () => {
    const callback = vi.fn<(i: number) => number>()
      .mockImplementation((i: number) => i)
    repeat(20, callback)
    expect(callback).toHaveBeenCalledTimes(20)
  })

  it('passes through the values returned by the callback', () => {
    const callback = (i: number) => ({ resultValue: i * 2 })
    const data = repeat(20, callback)
    data.forEach((_, i) => {
      expect(data[i]).toStrictEqual(callback(i))
    })
  })
})
