import { readStream } from './streams'
import 'compression-streams-polyfill'

export async function decompress (data: Uint8Array | string): Promise<Uint8Array> {
  return await readStream(new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip')))
}

export async function compress (data: Uint8Array | string): Promise<Uint8Array> {
  return await readStream(
    new Blob([data])
      .stream()
      .pipeThrough(new CompressionStream('gzip')))
}
