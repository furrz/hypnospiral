import { createState } from 'state-pool'
import { locStorage } from 'local_storage'

let hashState: any = {}

export const onHashStateUpdate = debounce(() => {
  if (Object.keys(hashState).length > 0) {
    history.replaceState(undefined, '', '#' + encodeURIComponent(JSON.stringify(hashState)))
  } else {
    history.replaceState(undefined, '', '#')
  }
})

function debounce<Args extends any[]> (func: (...args: Args) => void, timeout = 100) {
  let timer: any
  return (...args: Args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

if (typeof location !== 'undefined' && location.hash.length > 2) {
  try {
    // If it loads, change all the relevant state values.
    hashState = { ...JSON.parse(decodeURIComponent(location.hash.substring(1))) }
  } catch (e) {
    console.log(e)
  }
}

const createHashState = <T>(name: string, defaultValue: T) => {
  const state = createState(JSON.parse(JSON.stringify((hashState[name] !== undefined) ? hashState[name] : defaultValue)))

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
