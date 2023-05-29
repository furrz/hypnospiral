import * as React from "react";
import {Node, Shaders} from "gl-react";
import {Surface} from "gl-react-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {useBgColor, useFgColor, useSpinSpeed, useSpiralMode, useThrobSpeed, useThrobStrength, useZoom} from "state";

import spiralFrag from 'assets/spiral.frag';

const shaders = Shaders.create({
    spiral: {
        frag: spiralFrag
    },
    circle: {
        frag: spiralFrag
    }
})

export default function SpiralCanvas() {
    const targetRef = useRef<HTMLDivElement>();

    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    const [spinSpeed] = useSpinSpeed();
    const [throbSpeed] = useThrobSpeed();
    const [throbStrength] = useThrobStrength();
    const [zoom] = useZoom();
    const [fgColor] = useFgColor();
    const [bgColor] = useBgColor();
    const [spiralMode] = useSpiralMode();

    const animFrame = useCallback(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight
            });

            requestAnimationFrame(animFrame);
        }
    }, []);

    useEffect(() => {
        requestAnimationFrame(animFrame);
    }, [targetRef]);


    return <div className="spiral_canvas_div" ref={targetRef}>
        <Surface width={dimensions.width} height={dimensions.height}>
            <Node shader={spiralMode === "circle" ? shaders.circle : shaders.spiral}
                  uniforms={{
                      iTime: performance.now() / 1000.0,
                      iRes: [dimensions.width, dimensions.height],
                      spinSpeed,
                      throbSpeed,
                      throbStrength,
                      zoom,
                      spiralColor: [fgColor.r / 255, fgColor.g / 255, fgColor.b / 255],
                      bgColor: [bgColor.r / 255,bgColor.g / 255,bgColor.b / 255]
                  }}/>
        </Surface>
    </div>;
}