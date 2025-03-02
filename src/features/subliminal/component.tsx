import * as React from 'react'
import { Fragment, useEffect, useState } from 'react'
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
  useTxtColor
} from './state'
import { CancellableTimeout } from 'util/cancellable_timeout'
import { messageSequence, wallTextSequence } from './message_sequence'

export default function SpiralSubliminal () {
  const [textWall] = useTextWall()
  const [googleFont] = useCustomGoogleFont()
  const [txtColor] = useTxtColor()
  const [txtAlpha] = useMessageAlpha()
  const [currentText, setCurrentText] = useState([] as string[])

  const [messages] = useMessages()
  const [randomOrder] = useRandomOrder()
  const [messageGap] = useMessageGap()
  const [messageDuration] = useMessageDuration()
  const [oneWord] = useOneWord()

  let [fontFamily, fontWeight] = (googleFont ?? '').trim().split(':', 2)
  if (typeof fontWeight === 'undefined') fontWeight = ''
  const fontItalic = fontWeight.startsWith('i')
  if (fontItalic) fontWeight = fontWeight.substring(1)

  useEffect(() => {
    if (messages === null || messages.length < 1) return

    const timer = new CancellableTimeout()
    const messagesWithSplitWords = messages.map(m => oneWord ? (m.split(' ') ?? []) : [m ?? ''])
    const sequence = textWall
      ? wallTextSequence(messages, messageDuration)
      : messageSequence(messagesWithSplitWords, messageDuration, messageGap, randomOrder)

    function nextStepInSequence () {
      const nextInSequence = sequence.next()
      if (nextInSequence.done !== false) return
      setCurrentText(nextInSequence.value.word)
      timer.schedule(nextStepInSequence, nextInSequence.value.waitTime)
    }

    nextStepInSequence()

    return () => { timer.cancel() }
  }, [messages, messageGap, messageDuration, randomOrder, textWall, oneWord])

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
    </div>
  </Fragment>
}
