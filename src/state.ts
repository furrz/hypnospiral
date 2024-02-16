import { createState } from 'state-pool'
import { locStorage } from 'local_storage'
import { getStreamAsArrayBuffer } from 'get-stream'

let hashState: any = {}
const hashStateRefreshers: Array<() => void> = []

function base64ToBytes (base64: string) {
  const binString = atob(base64)
  return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0)
}

function bytesToBase64 (bytes: Uint8Array) {
  const binString = String.fromCodePoint(...bytes)
  return btoa(binString)
}

export const onHashStateUpdate = debounce(async () => {
  if (Object.keys(hashState).length > 0) {
    const jsonString = JSON.stringify(hashState)
    // Compress with gzip
    const compressedBytes = await getStreamAsArrayBuffer(
      new Blob([jsonString])
        .stream()
        .pipeThrough(new CompressionStream('gzip')))
    const b64 = bytesToBase64(new Uint8Array(compressedBytes))
    // Pick shorter encoding choice
    const candidate1 = encodeURIComponent(b64)
    const candidate2 = encodeURIComponent(jsonString)
    const choice = candidate1.length < candidate2.length ? candidate1 : candidate2
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
      const decoded = await getStreamAsArrayBuffer(new Blob([base64ToBytes(text)]).stream().pipeThrough(new DecompressionStream('gzip')))
      hashState = { ...JSON.parse(new TextDecoder().decode(decoded)) }
      hashStateRefreshers.forEach(c => { c() })
    }
  })().catch(e => {
    console.log(e)
  })
}

const createHashState = <T> (name: string, defaultValue: T) => {
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

export const useBgColor = createHashState('bgColor', { r: 0, g: 0, b: 0 })
export const useFgColor = createHashState('spColor', { r: 96, g: 255, b: 43 })
export const useTxtColor = createHashState('txtColor', { r: 255, g: 255, b: 255 })
export const useSpinSpeed = createHashState('spinSpeed', 1)
export const useThrobSpeed = createHashState('throbSpeed', 1)
export const useThrobStrength = createHashState('throbStrength', 1)
export const useZoom = createHashState('zoom', 1)
export const useMessages = createHashState('messages', [] as string[])
export const useMessageAlpha = createHashState('messageAlpha', 0.25)
export const useMessageDuration = createHashState('messageDuration', 0.1)
export const useMessageGap = createHashState('messageGap', 1)
export const useOneWord = createHashState('oneWord', true)
export const useRandomOrder = createHashState('randomOrder', true)
export const useBgImage = createHashState('bgImage', '')
export const useBgImageAlpha = createHashState('bgImageAlpha', 0.5)
export const useTextWall = createHashState('textWall', true)
export const useCustomGoogleFont = createHashState('customGoogleFont', '')
export const useSpiralMode = createHashState('spiralMode', 'spiral')

export const useRainbowColors = createHashState('rainbowColors', false)
export const useRainbowSaturation = createHashState('rainbowSaturation', 100)
export const useRainbowLightness = createHashState('rainbowLightness', 50)
export const useRainbowHueSpeed = createHashState('rainbowHueSpeed', 1)
export const useMuteOverlay = createHashState('muteOverlay', false)
export const useAudioSource = createHashState('audioSource', '')
export const dyslexiaState = createState(locStorage.getItem('dyslexic') !== null)
