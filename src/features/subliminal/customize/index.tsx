import * as React from 'react'
import { Fragment, useCallback, useId } from 'react'
import { Pencil, TextT, Timer } from '@phosphor-icons/react'
import { useMessageAlpha, useTextWall, useTxtColor, useWritingMode } from '../state'
import {
  Breadcrumb,
  ColourBox,
  FillGap,
  Label,
  Page,
  Radio,
  RadioOption,
  Slider,
  WideButton
} from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'

import IconLines from 'assets/LinesText.svg'
import IconWall from 'assets/WallText.svg'
import IconWriteLines from 'assets/WriteLines.svg'

export default function CustomizeSubliminalPage () {
  const opacitySliderId = useId()
  const [useWall, setUseWall] = useTextWall()
  const [opacity, setOpacity] = useMessageAlpha()
  const [colour, setColour] = useTxtColor()
  const [writingMode, setWritingMode] = useWritingMode()

  const currentMode = useWall ? 'wall' : (writingMode ? 'writing' : 'lines')
  const setMode = useCallback((value: string) => {
    setUseWall(value === 'wall')
    setWritingMode(value === 'writing')
  }, [])

  return <Fragment>
    <CustomizePage secondary/>
    <Page primary>
      <Breadcrumb>Customizer</Breadcrumb>
      <Label>
        text mode
        <Radio value={currentMode} onChange={setMode}>
          <RadioOption value="wall" label="Wall of Text Mode"><IconWall/></RadioOption>
          <RadioOption value="lines" label="Lines Mode"><IconLines/></RadioOption>
          <RadioOption value="writing" label="Line-Writing Mode"><IconWriteLines/></RadioOption>
        </Radio>
      </Label>
      <Label value={opacity} htmlFor={opacitySliderId}>
        colour + opacity
      </Label>
      <div className="input_row standalone_input">
        <ColourBox value={colour} onChange={setColour}/>
        <Slider value={opacity} onChange={setOpacity} id={opacitySliderId}/>
      </div>
      <WideButton to="/customize/subliminal/messages">
        edit messages
        <Pencil weight="bold"/>
      </WideButton>
      <WideButton to="/customize/subliminal/timing">
        timing + order
        <Timer weight="bold"/>
      </WideButton>
      <WideButton to="/customize/subliminal/font">
        custom font
        <TextT weight="bold"/>
      </WideButton>
      <FillGap/>
      <Previewer/>
    </Page>
  </Fragment>
}
