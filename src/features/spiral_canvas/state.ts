import { createHashState } from 'hash_state'

export const useBgColor = createHashState('bgColor', { r: 0, g: 0, b: 0 })
export const useFgColor = createHashState('spColor', { r: 96, g: 255, b: 43 })
export const useSpinSpeed = createHashState('spinSpeed', 1)
export const useThrobSpeed = createHashState('throbSpeed', 1)
export const useThrobStrength = createHashState('throbStrength', 1)
export const useZoom = createHashState('zoom', 1)
export const useSpiralMode = createHashState('spiralMode', 'spiral')
export const useRainbowColors = createHashState('rainbowColors', false)
export const useRainbowSaturation = createHashState('rainbowSaturation', 100)
export const useRainbowLightness = createHashState('rainbowLightness', 50)
export const useRainbowHueSpeed = createHashState('rainbowHueSpeed', 1)
