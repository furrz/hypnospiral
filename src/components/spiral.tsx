import * as React from "react";

import SpiralCanvas from "components/spiral_canvas";
import SpiralOverlay from "components/spiral_overlay";
import SpiralSubliminal from "components/spiral_subliminal";

export default function Spiral() {
    return <div className="spiral_container">
        <SpiralCanvas/>
        <SpiralOverlay/>
        <SpiralSubliminal/>
    </div>;
}