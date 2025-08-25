import { createHashState } from 'hash_state'

export const useBgImage = createHashState('bgImage', '')
export const useBgImageAlpha = createHashState('bgImageAlpha', 0.5)
export const useMuteOverlay = createHashState('muteOverlay', false)
export const useAudioSource = createHashState('audioSource', '')
