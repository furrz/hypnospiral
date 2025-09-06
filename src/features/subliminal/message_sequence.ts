import { pickRandom, repeat, shuffle } from 'util/array'

interface TextSequenceItem {
  word: string[]
  waitTime: number
  fontScale: number
  wordColor?: { r: number, g: number, b: number }
}

export function * messageSequence (messages: string[][], wordDuration: number, lineGapTime: number, randomizeOrder: boolean): Generator<TextSequenceItem> {
  for (const line of repeatingSequence(messages, randomizeOrder)) {
    for (const word of line) {
      const [wordWithoutWait, customDelay] = parseWaitSyntax(word)
      const [wordWithoutColor, overrideColor] = parseColorSyntax(wordWithoutWait)
      const [wordWithoutScale, fontScale] = parseFontScaleSyntax(wordWithoutColor)

      const cleanedWord =
        wordWithoutScale.split('\\n').map(str => str.trim())

      yield {
        word: cleanedWord,
        waitTime: (customDelay > 0) ? customDelay : wordDuration,
        wordColor: overrideColor,
        fontScale
      }
    }

    if (lineGapTime > 0) {
      // Leave a gap between lines
      yield {
        word: [''],
        waitTime: lineGapTime,
        wordColor: undefined,
        fontScale: 1
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
