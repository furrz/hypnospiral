import { createHashState } from 'hash_state'

export const useTxtColor = createHashState('txtColor', { r: 255, g: 255, b: 255 })
export const useTxtScale = createHashState('txtScale', 1.0)
export const useMessages = createHashState('messages', [] as string[])
export const useMessageAlpha = createHashState('messageAlpha', 0.25)
export const useMessageDuration = createHashState('messageDuration', 0.1)
export const useMessageGap = createHashState('messageGap', 1)
export const useOneWord = createHashState('oneWord', true)
export const useRandomOrder = createHashState('randomOrder', true)
export const useTextWall = createHashState('textWall', true)
export const useCustomGoogleFont = createHashState('customGoogleFont', '')
export const useWritingMode = createHashState('writingMode', false)
