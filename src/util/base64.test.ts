import { describe, it, expect } from 'vitest'
import { base64ToBytes, bytesToBase64 } from './base64'
import { genRandomBytes } from './random_bytes'

describe('base64ToBytes and bytesToBase64', () => {
  it('converts base64 to bytes', () => {
    expect(base64ToBytes('VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIDEzIGxhenkgZG9ncy4='))
      .toStrictEqual(new TextEncoder().encode('The quick brown fox jumps over 13 lazy dogs.'))
  })
  it('converts bytes to base64', () => {
    expect(bytesToBase64(new TextEncoder().encode('The quick brown fox jumps over 13 lazy dogs.')))
      .toStrictEqual('VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIDEzIGxhenkgZG9ncy4=')
  })

  it('can convert both ways', { repeats: 10 }, () => {
    const input = genRandomBytes()
    expect(base64ToBytes(bytesToBase64(input))).toStrictEqual(input)
  })
})
