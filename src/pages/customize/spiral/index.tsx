import * as React from 'react'
import { Fragment } from 'react'
import { Timer } from '@phosphor-icons/react'
import {
  Breadcrumb,
  Checkbox,
  ColourBox,
  FillGap,
  Label,
  Page,
  Radio,
  RadioOption, Slider,
  WideButton
} from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'
import {
  useBgColor,
  useFgColor,
  useRainbowColors,
  useRainbowHueSpeed,
  useRainbowLightness,
  useRainbowSaturation,
  useSpiralMode
} from 'state'

import IconSpiral from 'assets/SpiralStyle.svg'
import IconCircle from 'assets/CirclesStyle.svg'

export default function CustomizeSpiralPage () {
  const [spiralMode, setSpiralMode] = useSpiralMode()
  const [bgColor, setBgColor] = useBgColor()
  const [fgColor, setFgColor] = useFgColor()
  const [rainbowColors, setRainbowColors] = useRainbowColors()
  const [rainbowSaturation, setRainbowSaturation] = useRainbowSaturation()
  const [rainbowLightness, setRainbowLightness] = useRainbowLightness()
  const [rainbowHueSpeed, setRainbowHueSpeed] = useRainbowHueSpeed()

  return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb>Customizer</Breadcrumb>
            <Label>
                spiral type
                <Radio value={spiralMode} onChange={setSpiralMode}>
                    <RadioOption value="spiral"><IconSpiral/></RadioOption>
                    <RadioOption value="circle"><IconCircle/></RadioOption>
                </Radio>
            </Label>
            <Label>
                colours
                <>{!rainbowColors && <ColourBox value={bgColor} onChange={setBgColor}/>}</>
                <ColourBox value={fgColor} onChange={setFgColor}/>
            </Label>
            <Checkbox value={rainbowColors} onChange={setRainbowColors}>rainbow mode</Checkbox>
            {rainbowColors && <>
                <Label>
                    rainbow saturation
                    <Slider value={rainbowSaturation} onChange={setRainbowSaturation} min={0} max={100}/>
                </Label>
                <Label>
                    rainbow lightness
                    <Slider value={rainbowLightness} onChange={setRainbowLightness} min={0} max={100}/>
                </Label>
                <Label>
                    rainbow hue shift speed
                    <Slider value={rainbowHueSpeed} onChange={setRainbowHueSpeed} min={0} max={20}/>
                </Label>
            </>}
            <WideButton to="/customize/spiral/timing">
                motion + timing
                <Timer weight="bold"/>
            </WideButton>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>
}
