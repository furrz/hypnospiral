import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Node, Shaders } from 'gl-react'
import { Surface } from 'gl-react-dom'
import {
  useBgColor,
  useFgColor,
  useRainbowColors,
  useRainbowHueSpeed,
  useRainbowLightness,
  useRainbowSaturation,
  useSpinSpeed,
  useSpiralMode,
  useThrobSpeed,
  useThrobStrength,
  useZoom
} from './state'

import spiralFrag from './spiral.frag'
import concentricFrag from './concentric.frag'
import { colord } from 'colord'

const shaders = Shaders.create({
  spiral: {
    frag: spiralFrag
  },
  circle: {
    frag: concentricFrag
  }
})

export default function SpiralCanvas () {
  const iTime = performance.now() / 1000.0

  const targetRef = useRef<HTMLDivElement>(null)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const [spinSpeed] = useSpinSpeed()
  const [throbSpeed] = useThrobSpeed()
  const [throbStrength] = useThrobStrength()
  const [zoom] = useZoom()
  const [fgColor] = useFgColor()
  const [bgColor] = useBgColor()
  const [spiralMode] = useSpiralMode()
  const [rainbowColors] = useRainbowColors()
  const [rainbowSaturation] = useRainbowSaturation()
  const [rainbowLightness] = useRainbowLightness()
  const [rainbowHueSpeed] = useRainbowHueSpeed()
  const bgc = { ...bgColor }

  if (rainbowColors) {
    const newColor = colord({
      h: (iTime * 10.0 * rainbowHueSpeed) % 360,
      s: rainbowSaturation,
      l: rainbowLightness
    }).toRgb()
    bgc.r = newColor.r
    bgc.g = newColor.g
    bgc.b = newColor.b
  }

  const animFrame = useCallback(() => {
    if (targetRef.current != null) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      })

      requestAnimationFrame(animFrame)
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(animFrame)
  }, [targetRef])

  return <div className="spiral_canvas_div" ref={targetRef}>
    <Surface width={dimensions.width} height={dimensions.height}>
      <Node shader={spiralMode === 'circle' ? shaders.circle : shaders.spiral}
            uniforms={{
              iTime,
              iRes: [dimensions.width, dimensions.height],
              spinSpeed,
              throbSpeed,
              throbStrength,
              zoom,
              spiralColor: [fgColor.r / 255, fgColor.g / 255, fgColor.b / 255],
              bgColor: [bgc.r / 255, bgc.g / 255, bgc.b / 255]
            }}/>
    </Surface>
  </div>
}
