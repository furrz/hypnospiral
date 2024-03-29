import * as React from 'react'
import { colord } from 'colord'
import {
  useCustomGoogleFont,
  useMessageAlpha, useMessageDuration,
  useMessageGap,
  useMessages, useOneWord,
  useRandomOrder,
  useTextWall,
  useTxtColor
} from 'state'
import { Fragment, useEffect, useState } from 'react'

export default function SpiralSubliminal () {
  const [textWall] = useTextWall()
  const [googleFont] = useCustomGoogleFont()
  const [txtColor] = useTxtColor()
  const [txtAlpha] = useMessageAlpha()
  const [currentText, setCurrentText] = useState('')

  const [messages] = useMessages()
  const [randomOrder] = useRandomOrder()
  const [messageGap] = useMessageGap()
  const [messageDuration] = useMessageDuration()
  const [oneWord] = useOneWord()

  let [fontFamily, fontWeight] = (googleFont ?? '').trim().split(':', 2)
  if (typeof fontWeight === 'undefined' || fontWeight === '') fontWeight = ''
  const fontItalic = fontWeight.startsWith('i')
  if (fontItalic) fontWeight = fontWeight.substring(1)

  useEffect(() => {
    let timer: any
    let lineQueue: string[] = []
    let wordQueue: string[] = []

    const gapHandler = () => {
      setCurrentText('')
      timer = setTimeout(lineHandler, messageGap * 1000)
    }

    const lineWordHandler = () => {
      setCurrentText(wordQueue.shift() ?? '')

      if (wordQueue.length < 1) {
        timer = setTimeout(gapHandler, messageDuration * 1000)
      } else {
        timer = setTimeout(lineWordHandler, messageDuration * 1000)
      }
    }

    const lineHandler = () => {
      // Repopulate the Line Queue if it's empty
      if (lineQueue.length < 1) {
        lineQueue = [...messages]

        if (randomOrder) {
          // Durstenfeld shuffle
          for (let i = lineQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = lineQueue[i]
            lineQueue[i] = lineQueue[j]
            lineQueue[j] = temp
          }
        }
      }

      wordQueue = oneWord ? (lineQueue.shift()?.split(' ') ?? []) : [lineQueue.shift() ?? '']
      lineWordHandler()
    }

    const wallHandler = () => {
      let wallText = ''

      for (let i = 0; i < 800; i++) {
        wallText += messages[Math.floor(Math.random() * messages.length)] + ' '
      }

      setCurrentText(wallText)

      timer = setTimeout(wallHandler, messageDuration * 1000)
    }

    if (messages !== null && messages.length >= 1) {
      if (textWall) wallHandler()
      else lineHandler()
    }

    return () => { clearTimeout(timer) }
  }, [messages, messageGap, messageDuration, randomOrder, textWall, oneWord])

  return <Fragment>
        <link rel="stylesheet" href={'https://fonts.googleapis.com/css?family=' + googleFont}/>
        <div className={'subliminal_text' + (textWall ? ' wall' : '')} style={{
          fontFamily,
          fontWeight,
          fontStyle: fontItalic ? 'italic' : 'normal',
          color: colord({ a: txtAlpha, ...txtColor }).toRgbString()
        }}>
            {currentText}
        </div>
    </Fragment>
}
