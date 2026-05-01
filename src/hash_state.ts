import { createState } from 'state-pool'
import { base64ToBytes, bytesToBase64 } from 'util/base64'
import { compress, decompress } from 'util/compression'
import { debounce } from 'util/timer'

let hashState: any = {}
const hashStateRefreshers: Array<() => void> = []
export const activeState = createState(0)

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

export const createHashState = <T> (name: string, defaultValue: T, allowStates: boolean) => {
  if (allowStates) defaultValue = { 0: defaultValue } as any
  const valueOrDefault = (hashState[name] !== undefined) ? hashState[name] : defaultValue

  const state = createState(JSON.parse(JSON.stringify(valueOrDefault)))

  hashStateRefreshers.push(() => {
    let valueOrDefault = (hashState[name] !== undefined) ? hashState[name] : defaultValue
    // If value exists in hashState but in the wrong format (i.e. allowStates changed), convert it
    if (allowStates) {
      if (typeof valueOrDefault !== 'object' || 'r' in valueOrDefault || Array.isArray(valueOrDefault)) {
        valueOrDefault = { 0: valueOrDefault } as any
        if (valueOrDefault !== defaultValue) {
          hashState[name] = valueOrDefault
        }
      }
      state.setValue({ ...state.getValue(), ...JSON.parse(JSON.stringify(valueOrDefault)) })
    } else {
      if (typeof valueOrDefault === 'object' && !('r' in valueOrDefault) && !Array.isArray(valueOrDefault)) {
        valueOrDefault = valueOrDefault[0] !== undefined ? valueOrDefault[0] : defaultValue
        hashState[name] = valueOrDefault
      }
      state.setValue(JSON.parse(JSON.stringify(valueOrDefault)))
    }
  })

  if (allowStates) {
    return () => {
      const [currentState] = activeState.useState()
      const [value, setValue] = state.useState()
      return [(value[currentState] !== undefined ? value[currentState] : value[0]) as T, (newValue: T) => {
        if (hashState[name] === undefined) {
          hashState[name] = {} // Initialize early
        }
        if (currentState !== 0) {
          if (newValue !== value[0]) {
            setValue({ ...value, [currentState]: newValue })
            hashState[name][currentState] = newValue
          } else {
            if (value[currentState] !== undefined) {
              const valueCopy = { ...value }
              delete valueCopy[currentState]
              setValue(valueCopy)
              delete hashState[name][currentState]
            }
          }
        } else {
          setValue({ ...value, 0: newValue })

          if (JSON.stringify({ 0: newValue }) === JSON.stringify(defaultValue)) {
            delete hashState[name]
          } else {
            hashState[name][currentState] = newValue
          }
        }
        onHashStateUpdate()
      }] as [state: T, setState: (newState: T) => void]
    }
  } else {
    return () => {
      const [value, setValue] = state.useState()

      return [value as T, (newValue: T) => {
        setValue(newValue)

        if (JSON.stringify(newValue) === JSON.stringify(defaultValue)) {
          delete hashState[name]
        } else {
          hashState[name] = newValue
        }
        onHashStateUpdate()
      }] as [state: T, setState: (newState: T) => void]
    }
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
