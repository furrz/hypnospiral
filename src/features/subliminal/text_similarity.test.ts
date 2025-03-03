import { expect, test } from 'vitest'
import { textIsRoughlySimilar } from './text_similarity'

test('textIsRoughlySimilar handles identical text', () => {
  expect(textIsRoughlySimilar('this is the same', 'this is the same')).toBe(true)
})

test('textIsRoughlySimilar rejects equality if message is too short', () => {
  expect(textIsRoughlySimilar('this is shor', 'this is short')).toBe(false)
})

test('textIsRoughlySimilar ignores symbols and case', () => {
  expect(textIsRoughlySimilar('ThIs i$s same', 'thIS %%is same')).toBe(true)
})

test('textIsRoughlySimilar accepts simple typos', () => {
  expect(textIsRoughlySimilar('bybos in this test', 'typos in this text')).toBe(true)
})

test('textIsRoughlySimilar rejects lots of typos', () => {
  expect(textIsRoughlySimilar('memes in this texp', 'typos in this text')).toBe(false)
})
