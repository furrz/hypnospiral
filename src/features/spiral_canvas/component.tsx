import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Node, Shaders, GLSL } from 'gl-react'
import { Surface } from 'gl-react-dom'
import {
  useBgColor,
  useFgColor,
  useRainbowColors,
  useRainbowHueSpeed,
  useRainbowLightness,
  useRainbowSaturation,
  useArms,
  useSpinSpeed,
  useSpiralMode,
  useThrobSpeed,
  useThrobStrength,
  useZoom,
  useThickness,
  useBlur,
  useOpacity,
  useBgColor2,
  useRainbowColors2,
  useRainbowHueSpeed2,
  useRainbowLightness2,
  useRainbowSaturation2,
  useArms2,
  useSpinSpeed2,
  useSpiralMode2,
  useThrobSpeed2,
  useThrobStrength2,
  useZoom2,
  useThickness2,
  useBlur2,
  useOpacity2,
  useSecondary,
  useComposition
} from './state'

import spiralFrag from './shaders/spirals/spiral.frag'
import concentricFrag from './shaders/spirals/concentric.frag'
import squareFrag from './shaders/spirals/square.frag'
import logFrag from './shaders/spirals/logspiral.frag'
import concentricSquare from './shaders/spirals/concentricSquare.frag'
import heartFrag from './shaders/spirals/heart.frag'
import addFrag from './shaders/composite/add.frag'
import multiplyFrag from './shaders/composite/multiply.frag'
import alphaFrag from './shaders/composite/alpha.frag'
import { colord } from 'colord'

const spiralShaders = Shaders.create({
  heart: {
    frag: heartFrag
  },
  spiral: {
    frag: spiralFrag
  },
  circle: {
    frag: concentricFrag
  },
  square: {
    frag: squareFrag
  },
  logarithmic: {
    frag: logFrag
  },
  concentricSquare: {
    frag: concentricSquare
  }
})

const compositionShaders = Shaders.create({
  add: {
    frag: addFrag
  },
  alpha: {
    frag: alphaFrag
  },
  multiply: {
    frag: multiplyFrag
  }
})

const backgroundShader = Shaders.create({
  background: {
    frag: GLSL`
      precision highp float;
      uniform vec3 bgColor;
      void main() {
        gl_FragColor = vec4(bgColor, 1.0);
      }`
  }
})

export default function SpiralCanvas () {
  const iTime = performance.now() / 1000.0

  const targetRef = useRef<HTMLDivElement>(null)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const [arms] = useArms()
  const [spinSpeed] = useSpinSpeed()
  const [throbSpeed] = useThrobSpeed()
  const [throbStrength] = useThrobStrength()
  const [zoom] = useZoom()
  const [thickness] = useThickness()
  const [blur] = useBlur()
  const [opacity] = useOpacity()
  const [fgColor] = useFgColor()
  const [bgColor] = useBgColor()
  const [spiralMode] = useSpiralMode()
  const [rainbowColors] = useRainbowColors()
  const [rainbowSaturation] = useRainbowSaturation()
  const [rainbowLightness] = useRainbowLightness()
  const [rainbowHueSpeed] = useRainbowHueSpeed()
  const [arms2] = useArms2()
  const [spinSpeed2] = useSpinSpeed2()
  const [throbSpeed2] = useThrobSpeed2()
  const [throbStrength2] = useThrobStrength2()
  const [zoom2] = useZoom2()
  const [thickness2] = useThickness2()
  const [blur2] = useBlur2()
  const [opacity2] = useOpacity2()
  const [spiralMode2] = useSpiralMode2()
  const [bgColor2] = useBgColor2()
  const [rainbowColors2] = useRainbowColors2()
  const [rainbowSaturation2] = useRainbowSaturation2()
  const [rainbowLightness2] = useRainbowLightness2()
  const [rainbowHueSpeed2] = useRainbowHueSpeed2()
  const [secondarySpiral] = useSecondary()
  const [composition] = useComposition()
  const bgc = { ...bgColor }
  const bgc2 = { ...bgColor2 }

  const primaryShader = spiralShaders[spiralMode] ?? spiralShaders.spiral // Fallback value
  const secondaryShader = spiralShaders[spiralMode2] ?? spiralShaders.spiral

  const compositionShader = compositionShaders[composition] ?? compositionShaders.alpha

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

  if (rainbowColors2) {
    const newColor2 = colord({
      h: (iTime * 10.0 * rainbowHueSpeed2) % 360,
      s: rainbowSaturation2,
      l: rainbowLightness2
    }).toRgb()
    bgc2.r = newColor2.r
    bgc2.g = newColor2.g
    bgc2.b = newColor2.b
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

  const baseLayer = () => (
    <Node shader={compositionShaders.alpha} uniforms={{
      layer1: <Node shader={backgroundShader.background} uniforms={{ bgColor: [fgColor.r / 255, fgColor.g / 255, fgColor.b / 255] }} />,
      layer2: <Node shader={primaryShader}
                  uniforms={{
                    iTime,
                    iRes: [dimensions.width, dimensions.height],
                    arms,
                    spinSpeed,
                    throbSpeed,
                    throbStrength,
                    zoom,
                    thickness,
                    blur,
                    opacity,
                    spiralColor: [bgc.r / 255, bgc.g / 255, bgc.b / 255]
                  }}/>
    }}/>
  )

  return <div className="spiral_canvas_div" ref={targetRef}>
    <Surface width={dimensions.width} height={dimensions.height}>
      {secondarySpiral
        ? (<Node shader={compositionShader}
          uniforms={{
            layer1: baseLayer,
            layer2: () => <Node shader={secondaryShader}
                  uniforms={{
                    iTime,
                    iRes: [dimensions.width, dimensions.height],
                    arms: arms2,
                    spinSpeed: spinSpeed2,
                    throbSpeed: throbSpeed2,
                    throbStrength: throbStrength2,
                    zoom: zoom2,
                    thickness: thickness2,
                    blur: blur2,
                    opacity: opacity2,
                    spiralColor: [bgc2.r / 255, bgc2.g / 255, bgc2.b / 255]
                  }}/>
          }}/>)
        : (
            baseLayer()
          )
      }
    </Surface>
  </div>
}
