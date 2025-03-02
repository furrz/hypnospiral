import * as React from 'react'
import { Fragment } from 'react'
import CustomizePage from 'pages/customize'
import { Breadcrumb, Checkbox, FillGap, Label, Page, Slider } from 'components/building_blocks'
import Previewer from 'components/previewer'
import { useMessageDuration, useMessageGap, useOneWord, useRandomOrder, useTextWall, useWritingMode } from '../state'

export default function CustomizeSubliminalTimingPage () {
  const [textWall] = useTextWall()
  const [writingMode] = useWritingMode()
  const [messageDuration, setMessageDuration] = useMessageDuration()
  const [blankDuration, setBlankDuration] = useMessageGap()
  const [oneWord, setOneWord] = useOneWord()
  const [randomOrder, setRandomOrder] = useRandomOrder()

  return <Fragment>
    <CustomizePage secondary/>
    <Page primary>
      <Breadcrumb showInBigPrimary>Subliminal Text</Breadcrumb>
      {!writingMode && <Label value={messageDuration} unit="s">
        message duration
        <Slider value={messageDuration} onChange={setMessageDuration} min={0.01}/>
      </Label>}
      {!textWall && !writingMode && <Fragment>
        <Label value={blankDuration} unit="s">
          blank duration
          <Slider value={blankDuration} onChange={setBlankDuration} max={10}/>
        </Label>
        <Checkbox value={oneWord} onChange={setOneWord}>one word at a time</Checkbox>
        <Checkbox value={randomOrder} onChange={setRandomOrder}>random order</Checkbox>
      </Fragment>}
      <FillGap/>
      <Previewer/>
    </Page>
  </Fragment>
};
