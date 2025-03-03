import { expect, describe, it } from 'vitest'
import { messageSequence } from './message_sequence'

describe('messageSequence', () => {
  it('creates simple sequences correctly', () => {
    const messages = [['Sequence', 'One'], ['Sequence', 'Two']]
    const wordDuration = 1.2
    const lineGapTime = 1.5
    const seq = messageSequence(messages, wordDuration, lineGapTime, false)

    // Make sure sequences repeat correctly
    for (let i = 0; i < 2; i++) {
      expect(seq.next()).toStrictEqual({
        value: {
          word: ['Sequence'],
          waitTime: wordDuration
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: ['One'],
          waitTime: wordDuration
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: [''],
          waitTime: lineGapTime
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: ['Sequence'],
          waitTime: wordDuration
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: ['Two'],
          waitTime: wordDuration
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: [''],
          waitTime: lineGapTime
        },
        done: false
      })
    }
  })

  it('handles wait syntax correctly', () => {
    const messages = [['Normal Delay'], ['5sec Delay {wait:5}']]
    const wordDuration = 1.2
    const lineGapTime = 1.5
    const seq = messageSequence(messages, wordDuration, lineGapTime, false)

    expect(seq.next()).toStrictEqual({
      value: {
        word: ['Normal Delay'],
        waitTime: wordDuration
      },
      done: false
    })

    expect(seq.next()).toStrictEqual({
      value: {
        word: [''],
        waitTime: lineGapTime
      },
      done: false
    })

    expect(seq.next()).toStrictEqual({
      value: {
        word: ['5sec Delay'],
        waitTime: 5
      },
      done: false
    })

    expect(seq.next()).toStrictEqual({
      value: {
        word: [''],
        waitTime: lineGapTime
      },
      done: false
    })
  })
})
