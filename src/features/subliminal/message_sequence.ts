import { Float } from 'type-fest'
import { pickRandom, repeat, shuffle } from 'util/array'

export interface TextSequenceItem {
  word: string[]
  waitTime: number
  fontScale: number
  stateOverride?: number
  wordColor?: { r: number, g: number, b: number }
  askUserToWrite?: boolean
  rsvpHighlightPosition?: number
}

function emptyLine (gapTime: number) {
  return {
    word: [''],
    waitTime: gapTime,
    fontScale: 1,
    wordColor: undefined,
    askUserToWrite: undefined
  }
}

export function * messageSequence (messages: string[][], wordDuration: number, lineGapTime: number, randomizeOrder: boolean): Generator<TextSequenceItem> {
  let outputbuffer = []
  let buffer = false
  let randomizeBuffer = false
  // Inject state override into first message so that it resets when looping
  if (messages.length > 0 && messages[0].length > 0 && !messages[0][0].includes('{state:')) {
    messages[0][0] = `{state:0}${messages[0][0]}`
  }
  for (const line of repeatingSequence(messages, randomizeOrder)) {
    for (const word of line) {
      const [wordWithoutBeginRepeat, beginBuffer, randomizeRepeat] = parseBeginRepeatSyntax(word)
      const [wordWithoutRepeat, repeatCount] = parseRepeatSyntax(wordWithoutBeginRepeat)
      const [wordWithoutWait, customDelay] = parseWaitSyntax(wordWithoutRepeat)
      const [wordWithoutGap, lineGapOverride] = parseGapSyntax(wordWithoutWait)
      const [wordWithoutColor, overrideColor] = parseColorSyntax(wordWithoutGap)
      const [wordWithoutScale, fontScale] = parseFontScaleSyntax(wordWithoutColor)
      const [wordWithoutWrite, askUserToWrite] = parseWriteSyntax(wordWithoutScale)
      const [wordWithoutState, stateOverride] = parseStateSyntax(wordWithoutWrite)
      const cleanedWord =
          wordWithoutState.split('\\n').map(str => str.trim())

      const lineGapTimeToUse = lineGapOverride !== undefined ? lineGapOverride : lineGapTime

      const output = {
        lineGap: lineGapTimeToUse,
        line: {
          word: cleanedWord,
          waitTime: (customDelay > 0) ? customDelay : wordDuration,
          fontScale: fontScale,
          wordColor: overrideColor,
          askUserToWrite: askUserToWrite,
          stateOverride: randomizeOrder ? undefined : stateOverride
        }
      }

      if (beginBuffer && !buffer && !randomizeOrder) {
        buffer = true
        randomizeBuffer = randomizeRepeat
      }
      if (buffer) outputbuffer.push(output)

      if (repeatCount !== undefined && buffer) {
        buffer = false
        yield output.line
        if (output.lineGap > 0) yield emptyLine(output.lineGap)
        for (let i = 0; i < repeatCount; i++) {
          if (randomizeBuffer) shuffle(outputbuffer)
          for (const output of outputbuffer) {
            yield output.line
            if (output.lineGap > 0) yield emptyLine(output.lineGap)
          }
        }
        randomizeBuffer = false
        outputbuffer = []
      } else {
        yield output.line
        if (output.lineGap > 0) yield emptyLine(output.lineGap)
      }
    }
  }
}

export function * wallTextSequence (messages: string[], waitTime: number): Generator<TextSequenceItem> {
  while (true) {
    yield {
      word: [repeat(800, () => pickRandom(messages)).join(' ')],
      waitTime,
      fontScale: 1
    }
  }
}

export function * rsvpSequence (messages: string[], wpm: number): Generator<TextSequenceItem> {
  // Flatten all messages and split by whitespace, collapsing line breaks
  const outputs: any[] = []
  const speedMarkers = new Map<number, number>() // word index -> speed override
  const wordDuration = 60 / wpm // convert from wpm to delay

  // Inject state override into first message so that it resets when looping
  const messagesCopy = [...messages]
  messagesCopy[0] = `{state:0}${messagesCopy[0]}`

  let outputbuffer = []
  let buffer = false
  let randomizeBuffer = false

  for (const message of messagesCopy) {
    // Shift tags so they are attached to a word
    const shiftedTags = message.replace(/(?<=\s)({\S+})\s/gm, '$1')
    const words = shiftedTags.split(/\s+/).filter(w => w.length > 0)

    for (const word of words) {
      const [wordWithoutState, stateOverride] = parseStateSyntax(word)
      const [wordWithoutBeginRepeat, beginBuffer, randomizeRepeat] = parseBeginRepeatSyntax(wordWithoutState)
      const [wordWithoutRepeat, repeatCount] = parseRepeatSyntax(wordWithoutBeginRepeat)
      const [wordWithoutWait, customDelay] = parseWaitSyntax(wordWithoutRepeat)
      const [wordWithoutGap, lineGapOverride] = parseGapSyntax(wordWithoutWait)
      const [wordWithoutColor, overrideColor] = parseColorSyntax(wordWithoutGap)
      const [wordWithoutScale, fontScale] = parseFontScaleSyntax(wordWithoutColor)
      const [cleanedWord, speedOverride] = parseSpeedSyntax(wordWithoutScale)

      const output = {
        line: {
          word: [cleanedWord],
          waitTime: customDelay,
          fontScale,
          wordColor: overrideColor,
          stateOverride
        },
        lineGap: lineGapOverride
      }
      if (beginBuffer && !buffer) {
        buffer = true
        randomizeBuffer = randomizeRepeat
      }
      if (buffer) outputbuffer.push(output)

      if (repeatCount !== undefined && buffer) {
        buffer = false
        outputs.push(output)
        for (let i = 0; i < repeatCount; i++) {
          if (randomizeBuffer) shuffle(outputbuffer)
          for (const output of outputbuffer) {
            outputs.push(output)
          }
        }
        outputbuffer = []
        randomizeBuffer = false
      } else {
        outputs.push(output)
        if (speedOverride !== undefined) {
          speedMarkers.set(outputs.length - 1, speedOverride)
        }
      }
    }
  }

  // Function to get interpolated speed at a word index
  function getSpeedAtIndex (index: number): number {
    const markerIndices = Array.from(speedMarkers.keys()).sort((a, b) => a - b)

    // Find the markers before and after this index
    let markerBefore = -1
    let markerAfter = -1

    for (const markerIndex of markerIndices) {
      if (markerIndex <= index) {
        markerBefore = markerIndex
      } else if (markerAfter === -1) {
        markerAfter = markerIndex
      }
    }

    const speedAfter = speedMarkers.get(markerAfter) ?? wordDuration
    const speedBefore = speedMarkers.get(markerBefore) ?? wordDuration

    // No markers
    if (markerBefore === -1 && markerAfter === -1) {
      return wordDuration
    }

    // Only marker after
    if (markerBefore === -1) {
      const progress = index / markerAfter
      return wordDuration + (speedAfter - wordDuration) * progress
    }

    // Only marker before
    if (markerAfter === -1) {
      return speedBefore
    }

    // Both markers exist
    const progress = (index - markerBefore) / (markerAfter - markerBefore)
    return speedBefore + (speedAfter - speedBefore) * progress
  }

  // Infinitely repeat the word list (except when there are no words at all)
  while (outputs.length > 0) {
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i]
      const speed = output.line.waitTime > 0 ? output.line.waitTime : getSpeedAtIndex(i)

      yield {
        ...output.line,
        waitTime: speed
      }
      if (output.lineGap > 0) {
        yield emptyLine(output.lineGap)
      }
    }
  }
}

function * repeatingSequence<T> (items: T[], randomizeOrder: boolean): Generator<T> {
  while (true) {
    const scrambledSequence = [...items]
    if (randomizeOrder) shuffle(scrambledSequence)

    for (const item of scrambledSequence) yield item
  }
}

const waitMatch = /\{wait:([0-9]{1,3}(\.[0-9]{1,3})?)}/gi

function parseWaitSyntax (message: string): [cleanedMessage: string, customDelay: number] {
  const waitMatches = message.matchAll(waitMatch)

  let customDelay = 0
  for (const match of waitMatches) {
    customDelay += parseFloat(match[1])
  }

  const cleanedMessage = message.replace(waitMatch, '')

  return [cleanedMessage, customDelay]
}

const gapMatch = /\{gap:([0-9]{1,3}(\.[0-9]{1,3})?)}/gi

function parseGapSyntax (message: string): [cleanedMessage: string, lineGapTime: number | undefined] {
  const gapMatches = [...message.matchAll(gapMatch)]

  if (gapMatches.length === 0) {
    return [message, undefined]
  }

  let lineGapTime = 0
  for (const match of gapMatches) {
    lineGapTime += parseFloat(match[1])
  }
  const cleanedMessage = message.replace(gapMatch, '')
  return [cleanedMessage, lineGapTime]
}

const colorMatch = /\{colou?r:[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}}/gi

function parseColorSyntax (message: string): [cleanedMessage: string, overrideColor: {
  r: number
  g: number
  b: number
} | undefined] {
  const colorMatches = [...message.matchAll(colorMatch)]

  function clampToByte (n: number) {
    return Math.max(0, Math.min(255, n))
  }

  const cleanedMessage = message.replace(colorMatch, '')

  if (colorMatches.length > 0) {
    const colorStr = colorMatches[0][0].replace(/{colou?r:|}/, '')
    const [r, g, b] = colorStr.split(',').map(n => clampToByte(parseInt(n, 10)))
    return [cleanedMessage, { r, g, b }]
  } else {
    return [cleanedMessage, undefined]
  }
}

const fontScaleMatch = /\{fontScale:([0-9]{1,3}(\.[0-9]{1,3})?)}/gi

function parseFontScaleSyntax (message: string): [cleanedMessage: string, customScale: number] {
  const waitMatches = message.matchAll(fontScaleMatch)

  let scale = 1.0

  for (const match of waitMatches) {
    scale = parseFloat(match[1])
  }

  const cleanedMessage = message.replace(fontScaleMatch, '')
  return [cleanedMessage, scale]
}

const writeMatch = /\{write}/gi

function parseWriteSyntax (message: string): [cleanedMessage: string, userIsAskedToWriteLine: boolean] {
  const interactionMatches = [...message.matchAll(writeMatch)]
  const cleanedMessage = message.replace(writeMatch, '')
  return [cleanedMessage, interactionMatches.length > 0]
}

const speedMatch = /\{speed:([1-9][0-9]*)}/gi

function parseSpeedSyntax (message: string): [cleanedMessage: string, speedOverride: number | undefined] {
  const speedMatches = [...message.matchAll(speedMatch)]

  function clampSpeed (n: number) {
    return Math.max(60, Math.min(600, n))
  }

  function wpmToDelay (n: number) {
    return 60 / n
  }

  const cleanedMessage = message.replace(speedMatch, '')

  if (speedMatches.length > 0) {
    const speedStr = speedMatches[0][0].replace('{speed:', '').replace('}', '')
    const speed = wpmToDelay(clampSpeed(parseInt(speedStr)))
    return [cleanedMessage, speed]
  } else {
    return [cleanedMessage, undefined]
  }
}

const beginRepeatMatch = /\{begin-repeat(-random)?}/gi

function parseBeginRepeatSyntax (message: string): [cleanedMessage: string, bufferLines: boolean, randomizeOrder: boolean] {
  const beginMatches = [...message.matchAll(beginRepeatMatch)]
  const randomize = beginMatches.length > 0 && beginMatches[0][1] === '-random'
  const cleanedMessage = message.replace(beginRepeatMatch, '')
  return [cleanedMessage, beginMatches.length > 0, randomize]
}

const repeatMatch = /\{repeat:([1-9][0-9]*)}/gi

function parseRepeatSyntax (message: string): [cleanedMessage: string, repeatCount: number | undefined] {
  const repeatMatches = [...message.matchAll(repeatMatch)]

  function clampRepeatNo (n: number) {
    return Math.max(1, Math.min(99, n))
  }

  const cleanedMessage = message.replace(repeatMatch, '')

  if (repeatMatches.length > 0) {
    const repeatStr = repeatMatches[0][0].replace('{repeat:', '').replace('}', '')
    const repeatCount = clampRepeatNo(parseInt(repeatStr))
    return [cleanedMessage, repeatCount]
  } else {
    return [cleanedMessage, undefined]
  }
}

const stateMatch = /\{state:([0-9]+)}/gi

export function parseStateSyntax (message: string): [cleanedMessage: string, stateOverride: number | undefined] {
  const stateMatches = [...message.matchAll(stateMatch)]

  function clampStateNo (n: number) {
    return Math.max(0, Math.min(12, n))
  }

  const cleanedMessage = message.replace(stateMatch, '')

  if (stateMatches.length > 0) {
    const stateStr = stateMatches[0][0].replace('{state:', '').replace('}', '')
    const stateOverride = clampStateNo(parseInt(stateStr))
    return [cleanedMessage, stateOverride]
  } else {
    return [cleanedMessage, undefined]
  }
}
