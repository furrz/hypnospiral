import * as React from 'react'
import { Fragment } from 'react'
import { Timer } from '@phosphor-icons/react'
import {
  Breadcrumb,
  Checkbox,
  ColourBox,
  Dropdown,
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
  useOpacity,
  useRainbowColors,
  useRainbowHueSpeed,
  useRainbowLightness,
  useRainbowSaturation,
  useSpiralMode,
  useBgColor2,
  useOpacity2,
  useRainbowColors2,
  useRainbowHueSpeed2,
  useRainbowLightness2,
  useRainbowSaturation2,
  useSpiralMode2,
  useSecondary,
  useComposition
} from '../state'
import { activeState } from '../../../hash_state'

import IconArchemedian from 'assets/ArchemedianStyle.svg'
import IconLogarithmic from 'assets/LogarithmicStyle.svg'
import IconCircle from 'assets/CirclesStyle.svg'
import IconSquare from 'assets/SquareStyle.svg'
import IconSquareConc from 'assets/SquareConcStyle.svg'
import IconHeart from 'assets/HeartStyle.svg'

export default function CustomizeSpiralPage () {
  const [currentState, setCurrentState] = activeState.useState()
  const [spiralMode, setSpiralMode] = useSpiralMode()
  const [bgColor, setBgColor] = useBgColor()
  const [fgColor, setFgColor] = useFgColor()
  const [opacity, setOpacity] = useOpacity()
  const [rainbowColors, setRainbowColors] = useRainbowColors()
  const [rainbowSaturation, setRainbowSaturation] = useRainbowSaturation()
  const [rainbowLightness, setRainbowLightness] = useRainbowLightness()
  const [rainbowHueSpeed, setRainbowHueSpeed] = useRainbowHueSpeed()
  const [spiralMode2, setSpiralMode2] = useSpiralMode2()
  const [bgColor2, setBgColor2] = useBgColor2()
  const [opacity2, setOpacity2] = useOpacity2()
  const [rainbowColors2, setRainbowColors2] = useRainbowColors2()
  const [rainbowSaturation2, setRainbowSaturation2] = useRainbowSaturation2()
  const [rainbowLightness2, setRainbowLightness2] = useRainbowLightness2()
  const [rainbowHueSpeed2, setRainbowHueSpeed2] = useRainbowHueSpeed2()
  const [secondarySpiral, setSecondarySpiral] = useSecondary()
  const [composition, setComposition] = useComposition()

  return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb>Customizer</Breadcrumb>
            <Label value={currentState} setValue={setCurrentState}>
                state
                <Slider value={currentState} onChange={setCurrentState} min={0} max={12} step={1}/>
            </Label>
            <Label>
                background colour
                <ColourBox value={fgColor} onChange={setFgColor}/>
            </Label>
            <div>
                <Label>
                    spiral type
                    <Radio value={spiralMode} onChange={setSpiralMode}>
                        <RadioOption value="spiral" label="Spiral Style"><IconArchemedian/></RadioOption>
                        <RadioOption value="logarithmic" label="Logarithmic Style"><IconLogarithmic/></RadioOption>
                        <RadioOption value="circle" label="Circular Style"><IconCircle/></RadioOption>
                        <RadioOption value="square" label="Square Spiral Style"><IconSquare/></RadioOption>
                        <RadioOption value="concentricSquare" label="Square Style"><IconSquareConc/></RadioOption>
                        <RadioOption value="heart" label="Heart Style"><IconHeart/></RadioOption>
                    </Radio>
                </Label>
                <Label value={opacity} setValue={setOpacity}>
                    colour + opacity
                </Label>
                <div className="input_row standalone_input">
                    <>{!rainbowColors && <ColourBox value={bgColor} onChange={setBgColor}/>}</>
                    <Slider value={opacity} onChange={setOpacity} min={0} max={1}/>
                </div>
                <Checkbox value={rainbowColors} onChange={setRainbowColors}>rainbow mode</Checkbox>
                {rainbowColors && <>
                    <Label value={rainbowSaturation} setValue={setRainbowSaturation}>
                        rainbow saturation
                        <Slider value={rainbowSaturation} onChange={setRainbowSaturation} min={0} max={100}/>
                    </Label>
                    <Label value={rainbowLightness} setValue={setRainbowLightness}>
                        rainbow lightness
                        <Slider value={rainbowLightness} onChange={setRainbowLightness} min={0} max={100}/>
                    </Label>
                    <Label value={rainbowHueSpeed} setValue={setRainbowHueSpeed}>
                        rainbow hue shift speed
                        <Slider value={rainbowHueSpeed} onChange={setRainbowHueSpeed} min={0} max={20}/>
                    </Label>
                </>}
            </div>
            <Checkbox value={secondarySpiral} onChange={setSecondarySpiral}>secondary spiral</Checkbox>
            { secondarySpiral && <div>
                <Label>
                    composition
                    <Dropdown value={composition} defaultValue="alpha" onChange={setComposition}>
                        <option value="alpha">alpha</option>
                        <option value="add">add</option>
                        <option value="multiply">multiply</option>
                    </Dropdown>
                </Label>
                <Label>
                    spiral type
                    <Radio value={spiralMode2} onChange={setSpiralMode2}>
                        <RadioOption value="spiral" label="Spiral Style"><IconArchemedian/></RadioOption>
                        <RadioOption value="logarithmic" label="Logarithmic Style"><IconLogarithmic/></RadioOption>
                        <RadioOption value="circle" label="Circular Style"><IconCircle/></RadioOption>
                        <RadioOption value="square" label="Square Spiral Style"><IconSquare/></RadioOption>
                        <RadioOption value="concentricSquare" label="Square Style"><IconSquareConc/></RadioOption>
                        <RadioOption value="heart" label="Heart Style"><IconHeart/></RadioOption>
                    </Radio>
                </Label>
                <Label value={opacity2} setValue={setOpacity2}>
                    colour + opacity
                </Label>
                <div className="input_row standalone_input">
                    <>{!rainbowColors2 && <ColourBox value={bgColor2} onChange={setBgColor2}/>}</>
                    <Slider value={opacity2} onChange={setOpacity2} min={0} max={1}/>
                </div>
                <Checkbox value={rainbowColors2} onChange={setRainbowColors2}>rainbow mode</Checkbox>
                {rainbowColors2 && <>
                    <Label value={rainbowSaturation2} setValue={setRainbowSaturation2}>
                        rainbow saturation
                        <Slider value={rainbowSaturation2} onChange={setRainbowSaturation2} min={0} max={100}/>
                    </Label>
                    <Label value={rainbowLightness2} setValue={setRainbowLightness2}>
                        rainbow lightness
                        <Slider value={rainbowLightness2} onChange={setRainbowLightness2} min={0} max={100}/>
                    </Label>
                    <Label value={rainbowHueSpeed2} setValue={setRainbowHueSpeed2}>
                        rainbow hue shift speed
                        <Slider value={rainbowHueSpeed2} onChange={setRainbowHueSpeed2} min={0} max={20}/>
                    </Label>
                </>}
            </div>}
            <WideButton to="/customize/spiral/timing">
                motion + timing
                <Timer weight="bold"/>
            </WideButton>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>
}
