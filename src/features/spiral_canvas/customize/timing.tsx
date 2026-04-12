import * as React from 'react'
import { Fragment } from 'react'
import { useSpinSpeed, useThrobSpeed, useThrobStrength, useZoom, useThickness, useBlur } from '../state'
import { Breadcrumb, FillGap, Label, Page, Slider } from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'

export default function Timing () {
  const [spinSpeed, setSpinSpeed] = useSpinSpeed()
  const [throbSpeed, setThrobSpeed] = useThrobSpeed()
  const [throbStrength, setThrobStrength] = useThrobStrength()
  const [zoom, setZoom] = useZoom()
  const [thickness, setThickness] = useThickness()
  const [blur, setBlur] = useBlur()

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
        <Slider value={zoom} onChange={setZoom} min={-4} max={4}/>
      </Label>
      <Label value={thickness}>
        thickness
        <Slider value={thickness} onChange={setThickness} min={0.01} max={1.99} step={0.01}/>
      </Label>
      <Label value={blur}>
        blur factor
        <Slider value={blur} onChange={setBlur} min={0} max={1.99} step={0.01}/>
      </Label>
      <FillGap/>
      <Previewer/>
    </Page>
  </Fragment>
};
