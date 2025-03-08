import { createState } from 'state-pool'
import { base64ToBytes, bytesToBase64 } from 'util/base64'
import { compress, decompress } from 'util/compression'
import { debounce } from 'util/timer'

let hashState: any = {}
const hashStateRefreshers: Array<() => void> = []

/// ONLY for debugging purposes. Please please please don't use this to get state.
export function dumpCurrentHashState (): any {
  return JSON.stringify(hashState, null, 4)
}

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

export const createHashState = <T> (name: string, defaultValue: T) => {
  const state = createState(JSON.parse(JSON.stringify((hashState[name] !== undefined) ? hashState[name] : defaultValue)))

  hashStateRefreshers.push(() => {
    const valueOrDefault = (hashState[name] !== undefined) ? hashState[name] : defaultValue
    state.setValue(JSON.parse(JSON.stringify(valueOrDefault)))
  })

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
    }] as [state: T, setState: (newState: T) => void]
  }
}

// Initialize hashState values if we're in the browser and have a hash
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
