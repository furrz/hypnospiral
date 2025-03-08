import { describe, it, expect } from 'vitest'
import { compress, decompress } from './compression'
import { base64ToBytes } from './base64'
import { genRandomBytes } from './random_bytes'

describe('compress and decompress', () => {
  it('compresses correctly', async () => {
    expect(await compress('hello world')).toStrictEqual(base64ToBytes('H4sIAAAAAAAAE8tIzcnJVyjPL8pJAQCFEUoNCwAAAA=='))
  })

  it('decompresses correctly', async () => {
    const result = await decompress(base64ToBytes('H4sIAAAAAAAAE8tIzcnJVyjPL8pJAQCFEUoNCwAAAA=='))
    expect(new TextDecoder().decode(result)).toStrictEqual('hello world')
  })

  it('decompress undoes compress', { repeats: 10 }, async () => {
    // Generate random bytes
    const input = genRandomBytes()
    const compressed = await compress(input)
    const decompressed = await decompress(compressed)
    expect(decompressed).toStrictEqual(input)
  })
})
