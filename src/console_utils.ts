/// Exposes some simple dev / debugging tools in the browser console.
import { compress, decompress } from './util/compression'
import { base64ToBytes, bytesToBase64 } from './util/base64'
import { dumpCurrentHashState } from './hash_state'

const Global: any = (typeof window === 'undefined') ? {} : window

Global.hsv = {
  compression: {
    decode: async function (input: string): Promise<string> {
      return new TextDecoder().decode(await decompress(base64ToBytes(input)))
    },
    encode: async function (input: string): Promise<string> {
      return bytesToBase64(await compress(input))
    }
  },
  get state (): string {
    return dumpCurrentHashState()
  }
}
