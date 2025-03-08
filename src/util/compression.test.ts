import { describe, it, expect } from 'vitest'
import { compress, decompress } from './compression'
import { base64ToBytes } from './base64'

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
    const randByteCount = Math.floor(Math.random() * 128) + 2
    const genRandomByte = () => Math.floor(Math.random() * 256)
    const input = new Uint8Array(new Array(randByteCount).fill(0).map(genRandomByte))

    const compressed = await compress(input)
    const decompressed = await decompress(compressed)
    expect(decompressed).toStrictEqual(input)
  })
})
