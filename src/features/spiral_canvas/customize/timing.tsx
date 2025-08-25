import * as React from 'react'
import { Fragment } from 'react'
import { useSpinSpeed, useThrobSpeed, useThrobStrength, useZoom } from '../state'
import { Breadcrumb, FillGap, Label, Page, Slider } from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'

export default function Timing () {
  const [spinSpeed, setSpinSpeed] = useSpinSpeed()
  const [throbSpeed, setThrobSpeed] = useThrobSpeed()
  const [throbStrength, setThrobStrength] = useThrobStrength()
  const [zoom, setZoom] = useZoom()

  return <Fragment>
    <CustomizePage secondary/>
    <Page primary>
      <Breadcrumb showInBigPrimary>Spiral Style</Breadcrumb>
      <Label value={spinSpeed}>
        spin speed
        <Slider value={spinSpeed} onChange={setSpinSpeed} min={-4} max={4}/>
      </Label>
      <Label value={throbSpeed}>
        throb speed
        <Slider value={throbSpeed} onChange={setThrobSpeed} max={4}/>
      </Label>
      <Label value={throbStrength}>
        throb strength
        <Slider value={throbStrength} onChange={setThrobStrength} max={4}/>
      </Label>
      <Label value={zoom}>
        zoom
        <Slider value={zoom} onChange={setZoom} max={4}/>
      </Label>
      <FillGap/>
      <Previewer/>
    </Page>
  </Fragment>
};
