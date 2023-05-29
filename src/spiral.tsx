import * as React from "react";

import SpiralCanvas from "./spiral_canvas";
import SpiralOverlay from "./spiral_overlay";
import SpiralSubliminal from "./spiral_subliminal";


export default function Spiral() {


    return <div className="spiral_container">
        <SpiralCanvas/>
        <SpiralOverlay/>
        <SpiralSubliminal/>
    </div>;
}