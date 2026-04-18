import * as React from 'react'
import { Fragment } from 'react'
import {
  useArms,
  useSpinSpeed,
  useThrobSpeed,
  useThrobStrength,
  useZoom,
  useThickness,
  useBlur,
  useArms2,
  useSpinSpeed2,
  useThrobSpeed2,
  useThrobStrength2,
  useZoom2,
  useThickness2,
  useBlur2,
  useSecondary
} from '../state'
import { Breadcrumb, FillGap, Label, Page, Slider } from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'

export default function Timing () {
  const [arms, setArms] = useArms()
  const [spinSpeed, setSpinSpeed] = useSpinSpeed()
  const [throbSpeed, setThrobSpeed] = useThrobSpeed()
  const [throbStrength, setThrobStrength] = useThrobStrength()
  const [zoom, setZoom] = useZoom()
  const [thickness, setThickness] = useThickness()
  const [blur, setBlur] = useBlur()
  const [arms2, setArms2] = useArms2()
  const [spinSpeed2, setSpinSpeed2] = useSpinSpeed2()
  const [throbSpeed2, setThrobSpeed2] = useThrobSpeed2()
  const [throbStrength2, setThrobStrength2] = useThrobStrength2()
  const [zoom2, setZoom2] = useZoom2()
  const [thickness2, setThickness2] = useThickness2()
  const [blur2, setBlur2] = useBlur2()
  const [secondarySpiral] = useSecondary()
  return <Fragment>
    <CustomizePage secondary/>
    <Page primary>
      <Breadcrumb showInBigPrimary>Spiral Style</Breadcrumb>
      <Label value={arms} setValue={setArms} unitPrecision={1}>
        arms
        <Slider value={arms} onChange={setArms} min={1} max={12} step={1}/>
      </Label>
      <Label value={spinSpeed} setValue={setSpinSpeed}>
        spin speed
        <Slider value={spinSpeed} onChange={setSpinSpeed} min={-4} max={4}/>
      </Label>
      <Label value={throbSpeed} setValue={setThrobSpeed}>
        throb speed
        <Slider value={throbSpeed} onChange={setThrobSpeed} max={4}/>
      </Label>
      <Label value={throbStrength} setValue={setThrobStrength}>
        throb strength
        <Slider value={throbStrength} onChange={setThrobStrength} max={4}/>
      </Label>
      <Label value={zoom} setValue={setZoom}>
        zoom
        <Slider value={zoom} onChange={setZoom} min={-4} max={4}/>
      </Label>
      <Label value={thickness} setValue={setThickness}>
        thickness
        <Slider value={thickness} onChange={setThickness} min={0.01} max={1.99} step={0.01}/>
      </Label>
      <Label value={blur} setValue={setBlur}>
        blur factor
        <Slider value={blur} onChange={setBlur} min={0} max={1.99} step={0.01}/>
      </Label>
      {secondarySpiral && <>
        <label>secondary</label>
        <Label value={arms2} setValue={setArms2} unitPrecision={1}>
          arms
          <Slider value={arms2} onChange={setArms2} min={1} max={12} step={1}/>
        </Label>
        <Label value={spinSpeed2} setValue={setSpinSpeed2}>
          spin speed
          <Slider value={spinSpeed2} onChange={setSpinSpeed2} min={-4} max={4}/>
        </Label>
        <Label value={throbSpeed2} setValue={setThrobSpeed2}>
          throb speed
          <Slider value={throbSpeed2} onChange={setThrobSpeed2} max={4}/>
        </Label>
        <Label value={throbStrength2} setValue={setThrobStrength2}>
          throb strength
          <Slider value={throbStrength2} onChange={setThrobStrength2} max={4}/>
        </Label>
        <Label value={zoom2} setValue={setZoom2}>
          zoom
          <Slider value={zoom2} onChange={setZoom2} min={-4} max={4}/>
        </Label>
        <Label value={thickness2} setValue={setThickness2}>
          thickness
          <Slider value={thickness2} onChange={setThickness2} min={0.01} max={1.99} step={0.01}/>
        </Label>
        <Label value={blur2} setValue={setBlur2}>
          blur factor
          <Slider value={blur2} onChange={setBlur2} min={0} max={1.99} step={0.01}/>
        </Label>
      </>}
      <FillGap/>
      <Previewer/>
    </Page>
  </Fragment>
};
