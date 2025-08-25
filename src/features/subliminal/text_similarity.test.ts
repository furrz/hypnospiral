import { describe, expect, it } from 'vitest'
import { normalize, textIsRoughlySimilar } from './text_similarity'

describe('textIsRoughlySimilar', () => {
  it('handles identical text', () => {
    expect(textIsRoughlySimilar('this is the same', 'this is the same')).toBe(true)
  })

  it('rejects equality if message is too short', () => {
    expect(textIsRoughlySimilar('this is shor', 'this is short')).toBe(false)
  })

  it('can check typos in other languages', () => {
    expect(textIsRoughlySimilar('этотест', 'этоxест')).toBe(true)
    expect(textIsRoughlySimilar(' فهو يتحدّث بلغة يونيكود. تسجّل الآن لحضو', ' فهو يتحدّث بلغة وeنيكود. تسجّل الآن لحضو')).toBe(true)
  })

  it('ignores symbols and case', () => {
    expect(textIsRoughlySimilar('ThIs i$s same', 'thIS %%is same')).toBe(true)
  })

  it('accepts simple typos', () => {
    expect(textIsRoughlySimilar('bybos in this test', 'typos in this text')).toBe(true)
  })

  it('rejects lots of typos', () => {
    expect(textIsRoughlySimilar('memes in this texp', 'typos in this text')).toBe(false)
  })
})

describe('normalize', () => {
  it('strips whitespace from text', () => {
    expect(normalize('    test \n\t\n test \n\n\t  ')).toBe('testtest')
  })

  it('allows letters from other dialects', () => {
    expect(normalize('Это тест!')).toBe('этотест')
    expect(normalize(' فهو يتحدّث بلغة يونيكود. تسجّل الآن لحضو')).toBe('فهويتحدثبلغةيونيكودتسجلالآنلحضو')
  })

  it('converts everything to lowercase', () => {
    expect(normalize('HellOWORLD')).toBe('helloworld')
  })

  it('strips non-alphanumeric characters', () => {
    expect(normalize('%t@e*s@t(//123')).toBe('test')
  })

  it('handles a combination of whitespace and non-alphanumeric characters', () => {
    expect(normalize('    $     $fOo    ')).toBe('foo')
  })

  it('can handle empty input', () => {
    expect(normalize('')).toBe('')
  })

  it('can handle input of entirely characters to be stripped', () => {
    expect(normalize('\t\t\r\n\r\n\n\r\r   \b %10289379182\b\b  12')).toBe('')
  })
})
