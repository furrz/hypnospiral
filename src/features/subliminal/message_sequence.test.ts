import { expect, describe, it } from 'vitest'
import { messageSequence, rsvpSequence } from './message_sequence'

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
          waitTime: wordDuration,
          fontScale: 1,
          wordColor: undefined,
          askUserToWrite: false
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: ['One'],
          waitTime: wordDuration,
          fontScale: 1,
          wordColor: undefined,
          askUserToWrite: false
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: [''],
          waitTime: lineGapTime,
          fontScale: 1,
          wordColor: undefined,
          askUserToWrite: undefined
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: ['Sequence'],
          waitTime: wordDuration,
          fontScale: 1,
          wordColor: undefined,
          askUserToWrite: false
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: ['Two'],
          waitTime: wordDuration,
          fontScale: 1,
          wordColor: undefined,
          askUserToWrite: false
        },
        done: false
      })

      expect(seq.next()).toStrictEqual({
        value: {
          word: [''],
          waitTime: lineGapTime,
          fontScale: 1,
          wordColor: undefined,
          askUserToWrite: undefined
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
        waitTime: wordDuration,
        fontScale: 1,
        wordColor: undefined,
        askUserToWrite: false
      },
      done: false
    })

    expect(seq.next()).toStrictEqual({
      value: {
        word: [''],
        waitTime: lineGapTime,
        fontScale: 1,
        wordColor: undefined,
        askUserToWrite: undefined
      },
      done: false
    })

    expect(seq.next()).toStrictEqual({
      value: {
        word: ['5sec Delay'],
        waitTime: 5,
        fontScale: 1,
        wordColor: undefined,
        askUserToWrite: false
      },
      done: false
    })

    expect(seq.next()).toStrictEqual({
      value: {
        word: [''],
        waitTime: lineGapTime,
        fontScale: 1,
        wordColor: undefined,
        askUserToWrite: undefined
      },
      done: false
    })
  })
})

describe('rsvpSequence', () => {
  it('generates correct word sequence from single message', () => {
    const messages = ['hello world']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const result1 = seq.next().value
    expect(result1.word).toStrictEqual(['hello'])
    expect(result1.waitTime).toBe(wordDuration / 60)
    expect(result1.fontScale).toBe(1)
    expect(result1.rsvpHighlightPosition).toBe(2) // 40% of 5 chars = 2

    const result2 = seq.next().value
    expect(result2.word).toStrictEqual(['world'])
    expect(result2.waitTime).toBe(wordDuration / 60)
    expect(result2.fontScale).toBe(1)
    expect(result2.rsvpHighlightPosition).toBe(2) // 40% of 5 chars = 2
  })

  it('flattens multiple messages correctly', () => {
    const messages = ['hello world', 'foo bar']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const words = []
    for (let i = 0; i < 4; i++) {
      words.push(seq.next().value.word[0])
    }

    expect(words).toStrictEqual(['hello', 'world', 'foo', 'bar'])
  })

  it('applies speed markers inline with words', () => {
    const messages = ['hello{speed:120} world']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const helloResult = seq.next().value
    expect(helloResult.word).toStrictEqual(['hello'])
    expect(helloResult.waitTime).toBe(0.5) // speed marker applies to this word

    const worldResult = seq.next().value
    expect(worldResult.word).toStrictEqual(['world'])
    expect(worldResult.waitTime).toBe(0.5) // continues at marker speed after
  })

  it('interpolates speed linearly to speed marker', () => {
    const messages = ['one two three four five{speed:120}']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const speeds = []
    for (let i = 0; i < 5; i++) {
      speeds.push(seq.next().value.waitTime)
    }

    // Speed should interpolate from 1.0 to 0.5
    expect(speeds[0]).toBe(wordDuration / 60)
    expect(speeds[4]).toBe(0.5)
    // Middle values should be between start and end
    expect(speeds[1]).toBeLessThan(wordDuration / 60)
    expect(speeds[1]).toBeGreaterThan(0.5)
  })

  it('interpolates speed between two speed markers', () => {
    const messages = ['one two three four five{speed:300} six seven eight nine ten{speed:75}']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const speeds = []
    for (let i = 0; i < 10; i++) {
      speeds.push(seq.next().value.waitTime)
    }

    // First marker at index 4 with speed 0.2
    expect(speeds[4]).toBe(0.2)
    // Second marker at index 9 with speed 0.8
    expect(speeds[9]).toBe(0.8)
    // Speed should increase from 0.2 to 0.8 between markers
    expect(speeds[5]).toBeGreaterThan(0.2)
    expect(speeds[5]).toBeLessThan(0.8)
  })

  it('uses speed marker speed for words after marker with no subsequent marker', () => {
    const messages = ['one{speed:200} two three']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    seq.next() // one
    const twoResult = seq.next().value
    const threeResult = seq.next().value

    expect(twoResult.waitTime).toBe(0.3)
    expect(threeResult.waitTime).toBe(0.3)
  })

  it('repeats sequence infinitely', () => {
    const messages = ['hello world']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const firstRound = []
    for (let i = 0; i < 2; i++) {
      firstRound.push(seq.next().value.word[0])
    }

    const secondRound = []
    for (let i = 0; i < 2; i++) {
      secondRound.push(seq.next().value.word[0])
    }

    expect(firstRound).toStrictEqual(secondRound)
  })

  it('cleans up multiple spaces in message', () => {
    const messages = ['hello   world    foo']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const words = []
    for (let i = 0; i < 3; i++) {
      words.push(seq.next().value.word[0])
    }

    expect(words).toStrictEqual(['hello', 'world', 'foo'])
  })

  it('cleans speed syntax from words before yielding', () => {
    const messages = ['hello{speed:120} world']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    seq.next() // hello
    const worldResult = seq.next().value

    expect(worldResult.word).toStrictEqual(['world'])
    expect(worldResult.word[0]).not.toContain('speed')
  })

  it('handles empty string and whitespace-only messages', () => {
    const messages = ['   hello    ', '   ', 'world   ']
    const wordDuration = 1.0
    const seq = rsvpSequence(messages, wordDuration)

    const words = []
    for (let i = 0; i < 2; i++) {
      words.push(seq.next().value.word[0])
    }

    expect(words).toStrictEqual(['hello', 'world'])
  })

  it('handles multiple consecutive speed markers', () => {
    const messages = ['first{speed:200} second{speed:75}']
    const wordDuration = 1.0
    const seq = rsvpSequence(messages, wordDuration)

    const firstResult = seq.next().value
    expect(firstResult.word).toStrictEqual(['first'])
    expect(firstResult.waitTime).toBe(0.3)

    const secondResult = seq.next().value
    expect(secondResult.word).toStrictEqual(['second'])
    expect(secondResult.waitTime).toBe(0.8)
  })

  it('yields correct object structure', () => {
    const messages = ['test']
    const wordDuration = 60
    const seq = rsvpSequence(messages, wordDuration)

    const result = seq.next().value
    expect(result).toHaveProperty('word')
    expect(result).toHaveProperty('waitTime')
    expect(result).toHaveProperty('fontScale')
    expect(result).toHaveProperty('rsvpHighlightPosition')
    expect(Array.isArray(result.word)).toBe(true)
  })
})
