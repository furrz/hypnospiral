import * as React from 'react'
import {
  Fragment,
  type UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { colord } from 'colord'
import {
  useCustomGoogleFont,
  useHighlightColour,
  useMessageAlpha,
  useMessageDuration,
  useMessageGap,
  useWpm,
  useMessages,
  useOneWord,
  useRandomOrder,
  useRsvp,
  useTextWall,
  useTxtColor,
  useTxtScale,
  useWritingMode
} from './state'
import { CancellableTimeout } from 'util/timer'
import { messageSequence, wallTextSequence, rsvpSequence, type TextSequenceItem } from './message_sequence'
import { textIsRoughlySimilar } from './text_similarity'

interface TextState {
  word: string[]
  txtScale: number
  color?: { r: number, g: number, b: number }
  rsvpHighlightPosition?: number
}

export default function SpiralSubliminal () {
  const [textWall] = useTextWall()
  const [rsvp] = useRsvp()
  const [googleFont] = useCustomGoogleFont()
  const [txtColor] = useTxtColor()
  const [txtHighlight] = useHighlightColour()
  const [txtAlpha] = useMessageAlpha()
  const [txtScale] = useTxtScale()
  const [currentText, setCurrentText] = useState<TextState>({
    word: [],
    txtScale: 1,
    color: undefined,
    rsvpHighlightPosition: undefined
  })
  const [writingGoal, setWritingGoal] = useState(null as (null | {
    text: string
    callback: () => void
  }))

  const [messages] = useMessages()
  const [randomOrder] = useRandomOrder()
  const [messageGap] = useMessageGap()
  const [messageDuration] = useMessageDuration()
  const [wpm] = useWpm()
  const [oneWord] = useOneWord()
  const [writingMode] = useWritingMode()
  const writingInputRef = useRef<HTMLInputElement>(null)

  let [fontFamily, fontWeight] = (googleFont ?? '').trim().split(':', 2)
  if (typeof fontWeight === 'undefined') fontWeight = ''
  const fontItalic = fontWeight.startsWith('i')
  if (fontItalic) fontWeight = fontWeight.substring(1)

  const writingInputUpdated = useCallback((writingValue: string) => {
    if (writingGoal === null) return
    if (textIsRoughlySimilar(writingValue, writingGoal.text)) {
      setWritingGoal(null)
      if (writingInputRef.current !== null) writingInputRef.current.value = ''
      writingGoal.callback()
    }
  }, [writingMode, writingGoal])

  useEffect(() => {
    if (messages === null || messages.length < 1) return

    const timer = new CancellableTimeout()
    let sequence: Generator<TextSequenceItem, void, unknown>

    if (rsvp && !writingMode) {
      // RSVP mode: show one word at a time with focal point highlighted
      sequence = rsvpSequence(messages, wpm)
    } else if (textWall) {
      sequence = wallTextSequence(messages, messageDuration)
    } else {
      // Standard message sequence
      const doOneWord = oneWord && !writingMode
      const messagesWithSplitWords = messages.map(m => doOneWord ? (m.split(' ') ?? []) : [m ?? ''])
      const trueMessageGap = writingMode ? 0 : messageGap
      sequence = messageSequence(messagesWithSplitWords, messageDuration, trueMessageGap, randomOrder)
    }

    function nextStepInSequence () {
      let nextInSequence = sequence.next()
      if (nextInSequence.done !== false) return

      const item = nextInSequence.value

      setCurrentText({
        word: item.word,
        color: item.wordColor ?? undefined,
        txtScale: item.fontScale ?? 1,
        rsvpHighlightPosition: item.rsvpHighlightPosition
      })

      const shouldWrite = Boolean(writingMode) || Boolean(item.askUserToWrite)
      if (shouldWrite) {
        // Writing mode doesn't like blank lines.
        let infiniteLoopEscapeCountdown = 32
        let currentItem = item
        while ((currentItem.word as string[])?.length === 0 || (currentItem.word as string[])?.every((s: string) => s.trim() === '')) {
          nextInSequence = sequence.next()
          if (nextInSequence.done !== false) return
          infiniteLoopEscapeCountdown--
          if (infiniteLoopEscapeCountdown <= 0) break
          currentItem = nextInSequence.value
        }
        const itemInLoop = nextInSequence.value
        setCurrentText({
          word: itemInLoop.word,
          color: itemInLoop.wordColor,
          txtScale: itemInLoop.fontScale ?? 1,
          rsvpHighlightPosition: itemInLoop.rsvpHighlightPosition
        })

        setWritingGoal({
          text: nextInSequence.value.word.join(' '),
          callback: () => {
            setWritingGoal(null)
            nextStepInSequence()
          }
        })
      } else {
        timer.schedule(nextStepInSequence, nextInSequence.value.waitTime)
      }
    }

    nextStepInSequence()

    return () => {
      setWritingGoal(null)
      timer.cancel()
    }
  }, [messages, messageGap, messageDuration, randomOrder, textWall, oneWord, writingMode, rsvp])

  return <Fragment>
    <link rel="stylesheet"
          href={'https://fonts.googleapis.com/css?family=' + googleFont}/>
    <div className={'subliminal_text' + (textWall ? ' wall' : '') + (rsvp ? ' rsvp' : '')} style={{
      fontFamily,
      fontWeight,
      fontStyle: fontItalic ? 'italic' : 'normal',
      color: colord({ a: txtAlpha, ...txtColor }).toRgbString()
    }}>
      <span style={{ width: '100%' }}>
      {currentText.word.map((item, i) => {
        if (rsvp && currentText.rsvpHighlightPosition !== undefined && item.length > 0) {
          // RSVP mode: render with focal character highlighted
          // The focal character stays perfectly centered on screen
          const focusPos = currentText.rsvpHighlightPosition
          const before = item.substring(0, focusPos)
          const focal = item[focusPos]
          const after = item.substring(focusPos + 1)

          return <Fragment key={i}>{i !== 0 && <br/>}
            <span style={{
              fontSize: ((currentText.txtScale * txtScale) * 100.0).toFixed(2) + '%',
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: '1fr min-content 1fr',
              whiteSpace: 'nowrap',
              width: '100%',
              color: colord({ a: txtAlpha, ...txtColor }).toRgbString(),
              margin: '0'
            }}>
              <span style={{
                justifySelf: 'right'
              }}>{before}</span>
              <span style={{ color: colord({ a: txtAlpha, ...txtHighlight }).toRgbString() }}>{focal}</span>
              <span style={{
                justifySelf: 'left'
              }}>{after}</span>
            </span>
          </Fragment>
        } else {
          // Normal rendering
          return <Fragment key={i}>{i !== 0 && <br/>}
            <span style={{
              color: colord({
                a: txtAlpha,
                ...(currentText.color ?? txtColor)
              }).toRgbString(),
              fontSize: ((currentText.txtScale * txtScale) * 100.0).toFixed(2) + '%'
            }}>
              {item}
            </span>
          </Fragment>
        }
      })}
        </span>
      {writingGoal !== null && <div className="subliminal_input">
        <input type="text" ref={writingInputRef}
               onMouseDown={justStopPropagation}
               onKeyDown={justStopPropagation}
               onClick={justStopPropagation}
               placeholder="Type Here"
               autoFocus={true}
               onChange={e => { writingInputUpdated(e.target.value) }}/>
      </div>}
    </div>
  </Fragment>
}

function justStopPropagation (e: UIEvent) {
  e.stopPropagation()
}
