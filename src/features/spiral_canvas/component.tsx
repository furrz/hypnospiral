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
  useSpinSpeed2,
  useSpiralMode2,
  useThrobSpeed2,
  useThrobStrength2,
  useZoom2,
  useThickness2,
  useBlur2,
  useOpacity2,
  useSecondary
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
  },
  composite: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D layer1;
      uniform sampler2D layer2;
      void main() {
        vec4 c1 = texture2D(layer1, uv);
        vec4 c2 = texture2D(layer2, uv);
        // standard alpha compositing
        vec3 color = mix(c1.rgb, c2.rgb, c2.a);
        float alpha = max(c1.a, c2.a);
        gl_FragColor = vec4(color, alpha);
      }`
  },
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
  const bgc = { ...bgColor }
  const bgc2 = { ...bgColor2 }

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
    <Node shader={shaders.composite} uniforms={{
      layer1: <Node shader={shaders.background} uniforms={{ bgColor: [fgColor.r / 255, fgColor.g / 255, fgColor.b / 255] }} />,
      layer2: <Node shader={spiralMode === 'circle' ? shaders.circle : shaders.spiral}
                  uniforms={{
                    iTime,
                    iRes: [dimensions.width, dimensions.height],
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
        ? (<Node shader={shaders.composite}
          uniforms={{
            layer1: baseLayer,
            layer2: () => <Node shader={spiralMode2 === 'circle' ? shaders.circle : shaders.spiral}
                  uniforms={{
                    iTime,
                    iRes: [dimensions.width, dimensions.height],
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
