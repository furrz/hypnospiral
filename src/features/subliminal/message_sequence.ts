import { pickRandom, repeat, shuffle } from 'util/array'

interface TextSequenceItem {
  word: string[]
  waitTime: number
}

export function * messageSequence (messages: string[][], wordDuration: number, lineGapTime: number, randomizeOrder: boolean): Generator<TextSequenceItem> {
  for (const line of repeatingSequence(messages, randomizeOrder)) {
    for (const word of line) {
      const [cleanedWord, customDelay] = parseWaitSyntax(word)
      yield {
        word: cleanedWord,
        waitTime: (customDelay > 0) ? customDelay : wordDuration
      }
    }

    if (lineGapTime > 0) {
      // Leave a gap between lines
      yield {
        word: [''],
        waitTime: lineGapTime
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

const waitMatch = /{wait:([0-9]{1,3}(\.[0-9]{1,3})?)}/gi

function parseWaitSyntax (message: string): [cleanedMessage: string[], customDelay: number] {
  const waitMatches = message.matchAll(waitMatch)

  let customDelay = 0
  for (const match of waitMatches) {
    customDelay += parseFloat(match[1])
  }

  const cleanedMessage = message.replace(waitMatch, '').split('\\n').map(str => str.trim())

  return [cleanedMessage, customDelay]
}
