import { pickRandom, repeat, shuffle } from 'util/array'

interface TextSequenceItem {
  word: string[]
  waitTime: number
  wordColor?: { r: number, g: number, b: number }
}

export function * messageSequence (messages: string[][], wordDuration: number, lineGapTime: number, randomizeOrder: boolean): Generator<TextSequenceItem> {
  for (const line of repeatingSequence(messages, randomizeOrder)) {
    for (const word of line) {
      const [wordWithoutWait, customDelay] = parseWaitSyntax(word)
      const [cleanedWord, overrideColor] = parseColorSyntax(wordWithoutWait[0])
      yield {
        word: cleanedWord,
        waitTime: (customDelay > 0) ? customDelay : wordDuration,
        wordColor: overrideColor
      }
    }

    if (lineGapTime > 0) {
      // Leave a gap between lines
      yield {
        word: [''],
        waitTime: lineGapTime,
        wordColor: undefined
      }
    }
  }
}

export function * wallTextSequence (messages: string[], waitTime: number): Generator<TextSequenceItem> {
  while (true) {
    yield {
      word: [repeat(800, () => pickRandom(messages)).join(' ')],
      waitTime
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

function parseWaitSyntax (message: string): [cleanedMessage: string[], customDelay: number] {
  const waitMatches = message.matchAll(waitMatch)

  let customDelay = 0
  for (const match of waitMatches) {
    customDelay += parseFloat(match[1])
  }

  const cleanedMessage = message.replace(waitMatch, '').split('\\n').map(str => str.trim())

  return [cleanedMessage, customDelay]
}

const colorMatch = /\{color:[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}}/gi

function parseColorSyntax (message: string): [cleanedMessage: string[], overrideColor: {
  r: number
  g: number
  b: number
} | undefined] {
  const colorMatches = [...message.matchAll(colorMatch)]

  function clampToByte (n: number) {
    return Math.max(0, Math.min(255, n))
  }

  const cleanedMessage = message.replace(colorMatch, '').split('\\n').map(str => str.trim())

  if (colorMatches.length > 0) {
    const colorStr = colorMatches[0][0].replace('{color:', '').replace('}', '')
    const [r, g, b] = colorStr.split(',').map(n => clampToByte(parseInt(n, 10)))
    return [cleanedMessage, { r, g, b }]
  } else {
    return [cleanedMessage, undefined]
  }
}
