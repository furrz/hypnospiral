import { Float } from 'type-fest'
import { pickRandom, repeat, shuffle } from 'util/array'

export interface TextSequenceItem {
  word: string[]
  waitTime: number
  fontScale: number
  wordColor?: { r: number, g: number, b: number }
  askUserToWrite?: boolean
  rsvpHighlightPosition?: number
}

export function * messageSequence (messages: string[][], wordDuration: number, lineGapTime: number, randomizeOrder: boolean): Generator<TextSequenceItem> {
  for (const line of repeatingSequence(messages, randomizeOrder)) {
    for (const word of line) {
      const [wordWithoutWait, customDelay] = parseWaitSyntax(word)
      const [wordWithoutColor, overrideColor] = parseColorSyntax(wordWithoutWait)
      const [wordWithoutScale, fontScale] = parseFontScaleSyntax(wordWithoutColor)
      const [wordWithoutWrite, askUserToWrite] = parseWriteSyntax(wordWithoutScale)

      const cleanedWord =
          wordWithoutWrite.split('\\n').map(str => str.trim())

      yield {
        word: cleanedWord,
        waitTime: (customDelay > 0) ? customDelay : wordDuration,
        fontScale: fontScale,
        wordColor: overrideColor,
        askUserToWrite: askUserToWrite
      }
    }

    if (lineGapTime > 0) {
      // Leave a gap between lines
      yield {
        word: [''],
        waitTime: lineGapTime,
        fontScale: 1,
        wordColor: undefined,
        askUserToWrite: undefined
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
  const allWords: string[] = []
  const speedMarkers = new Map<number, number>() // word index -> speed override
  const wordDuration = 60 / wpm // convert from wpm to delay

  for (const message of messages) {
    const words = message.split(/\s+/).filter(w => w.length > 0)
    for (const word of words) {
      const [cleanedWord, speedOverride] = parseSpeedSyntax(word)
      allWords.push(cleanedWord)
      if (speedOverride !== undefined) {
        speedMarkers.set(allWords.length - 1, speedOverride)
        console.log('found speedmarker')
      }
    }
  }

  console.log(speedMarkers)

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

    // If no markers, use default wordDuration
    if (markerBefore === -1 && markerAfter === -1) {
      return wordDuration
    }

    // If only marker after, linearly interpolate from wordDuration to speedAfter
    if (markerBefore === -1 && markerAfter !== -1) {
      const speedAfter = speedMarkers.get(markerAfter)!
      const progress = index / markerAfter
      return wordDuration + (speedAfter - wordDuration) * progress
    }

    // If only marker before, use its speed until the end
    if (markerBefore !== -1 && markerAfter === -1) {
      return speedMarkers.get(markerBefore)!
    }

    // Linearly interpolate between markerBefore and markerAfter
    const speedBefore = speedMarkers.get(markerBefore)!
    const speedAfter = speedMarkers.get(markerAfter)!
    const progress = (index - markerBefore) / (markerAfter - markerBefore)
    return speedBefore + (speedAfter - speedBefore) * progress
  }

  // Infinitely repeat the word list
  while (true) {
    for (let i = 0; i < allWords.length; i++) {
      const word = allWords[i]
      const speed = getSpeedAtIndex(i)

      // Calculate the focal point: 40% through the word, rounded down
      const focalIndex = Math.floor(word.length * 0.4)

      yield {
        word: [word],
        waitTime: speed,
        fontScale: 1,
        rsvpHighlightPosition: focalIndex
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
    const colorStr = colorMatches[0][0].replace('{color:', '').replace('}', '')
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
    return Math.max(1, Math.min(999, n))
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
