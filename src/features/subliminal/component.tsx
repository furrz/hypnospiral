import * as React from 'react'
import { Fragment, type UIEvent, useCallback, useEffect, useRef, useState } from 'react'
import { colord } from 'colord'
import {
  useCustomGoogleFont,
  useMessageAlpha,
  useMessageDuration,
  useMessageGap,
  useMessages,
  useOneWord,
  useRandomOrder,
  useTextWall,
  useTxtColor,
  useWritingMode
} from './state'
import { CancellableTimeout } from 'util/cancellable_timeout'
import { messageSequence, wallTextSequence } from './message_sequence'
import { textIsRoughlySimilar } from './text_similarity'

export default function SpiralSubliminal () {
  const [textWall] = useTextWall()
  const [googleFont] = useCustomGoogleFont()
  const [txtColor] = useTxtColor()
  const [txtAlpha] = useMessageAlpha()
  const [currentText, setCurrentText] = useState([] as string[])
  const [writingGoal, setWritingGoal] = useState(null as (null | { text: string, callback: () => void }))

  const [messages] = useMessages()
  const [randomOrder] = useRandomOrder()
  const [messageGap] = useMessageGap()
  const [messageDuration] = useMessageDuration()
  const [oneWord] = useOneWord()
  const [writingMode] = useWritingMode()
  const writingInputRef = useRef<HTMLInputElement>(null)

  let [fontFamily, fontWeight] = (googleFont ?? '').trim().split(':', 2)
  if (typeof fontWeight === 'undefined') fontWeight = ''
  const fontItalic = fontWeight.startsWith('i')
  if (fontItalic) fontWeight = fontWeight.substring(1)

  const writingInputUpdated = useCallback((writingValue: string) => {
    if (!writingMode) return
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
    const messagesWithSplitWords = messages.map(m => oneWord ? (m.split(' ') ?? []) : [m ?? ''])
    const trueMessageGap = writingMode ? 0 : messageGap
    const sequence = textWall
      ? wallTextSequence(messages, messageDuration)
      : messageSequence(messagesWithSplitWords, messageDuration, trueMessageGap, randomOrder)

    function nextStepInSequence () {
      const nextInSequence = sequence.next()
      if (nextInSequence.done !== false) return

      setCurrentText(nextInSequence.value.word)

      if (writingMode) {
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
  }, [messages, messageGap, messageDuration, randomOrder, textWall, oneWord, writingMode])

  return <Fragment>
    <link rel="stylesheet" href={'https://fonts.googleapis.com/css?family=' + googleFont}/>
    <div className={'subliminal_text' + (textWall ? ' wall' : '')} style={{
      fontFamily,
      fontWeight,
      fontStyle: fontItalic ? 'italic' : 'normal',
      color: colord({ a: txtAlpha, ...txtColor }).toRgbString()
    }}>
      {currentText.map((item, i) =>
        (i === 0) ? <>{item}</> : <><br/>{item}</>)}
      {writingGoal !== null && <div className="subliminal_input">
        <input type="text" ref={writingInputRef}
               onMouseDown={justStopPropagation}
               onKeyDown={justStopPropagation}
               onClick={justStopPropagation}
               placeholder="Type Here"
               onChange={e => { writingInputUpdated(e.target.value) }}/>
      </div>}
    </div>
  </Fragment>
}

function justStopPropagation (e: UIEvent) {
  e.stopPropagation()
}
