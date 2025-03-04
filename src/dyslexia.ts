import { createState } from 'state-pool'
import { locStorage } from 'util/local_storage'

const dyslexiaState = createState(locStorage.getItem('dyslexic') !== null)

export const useDyslexiaState = () => dyslexiaState.useState()
