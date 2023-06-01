import * as React from 'react'
import { Fragment } from 'react'
import { Timer } from '@phosphor-icons/react'
import { Breadcrumb, ColourBox, FillGap, Label, Page, Radio, RadioOption, WideButton } from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'
import { useBgColor, useFgColor, useSpiralMode } from 'state'

import IconSpiral from 'assets/SpiralStyle.svg'
import IconCircle from 'assets/CirclesStyle.svg'

export default function CustomizeSpiralPage () {
  const [spiralMode, setSpiralMode] = useSpiralMode()
  const [bgColor, setBgColor] = useBgColor()
  const [fgColor, setFgColor] = useFgColor()

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
                <ColourBox value={bgColor} onChange={setBgColor}/>
                <ColourBox value={fgColor} onChange={setFgColor}/>
            </Label>
            <WideButton to="/customize/spiral/timing">
                motion + timing
                <Timer weight="bold"/>
            </WideButton>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>
}
