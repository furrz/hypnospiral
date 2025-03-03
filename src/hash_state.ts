import { createState } from 'state-pool'
import { base64ToBytes, bytesToBase64 } from 'util/base64'
import { compress, decompress } from 'util/compression'

let hashState: any = {}
const hashStateRefreshers: Array<() => void> = []

export const onHashStateUpdate = debounce(async () => {
  if (Object.keys(hashState).length > 0) {
    const jsonString = JSON.stringify(hashState)
    const encodedJsonCandidate = encodeURIComponent(jsonString)

    let choice = encodedJsonCandidate

    try {
      // Compress with gzip
      const compressedBytes = await compress(jsonString)
      const b64 = bytesToBase64(compressedBytes)

      // Pick shorter encoding choice
      const compressedDataCandidate = encodeURIComponent(b64)
      choice = compressedDataCandidate.length < encodedJsonCandidate.length
        ? compressedDataCandidate
        : encodedJsonCandidate
    } catch (e) {
      console.error(e)
    }
    history.replaceState(undefined, '', '#' + choice)
  } else {
    history.replaceState(undefined, '', '#')
  }
})

function debounce<Args extends any[]> (func: (...args: Args) => void | Promise<void>, timeout = 100) {
  let timer: any
  return (...args: Args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

if (typeof location !== 'undefined' && location.hash.length > 2) {
  (async () => {
    // If it loads, change all the relevant state values.
    const text = decodeURIComponent(location.hash.substring(1))
    if (text.startsWith('{')) hashState = { ...JSON.parse(text) }
    else {
      const decoded = await decompress(base64ToBytes(text))
      hashState = { ...JSON.parse(new TextDecoder().decode(decoded)) }
      hashStateRefreshers.forEach(c => { c() })
    }
  })().catch(e => {
    console.log(e)
  })
}

export const createHashState = <T> (name: string, defaultValue: T) => {
  const state = createState(JSON.parse(JSON.stringify((hashState[name] !== undefined) ? hashState[name] : defaultValue)))
  hashStateRefreshers.push(() => { state.setValue(JSON.parse(JSON.stringify((hashState[name] !== undefined) ? hashState[name] : defaultValue))) })
  return () => {
    const [value, setValue] = state.useState()

    return [value as T, (newValue: T) => {
      setValue(newValue)
      if (JSON.stringify(newValue) !== JSON.stringify(defaultValue)) {
        hashState[name] = newValue
      } else {
        delete hashState[name]
      }
      onHashStateUpdate()
    }] as [T, (_: T) => void]
  }
}
