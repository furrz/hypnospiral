import * as React from "react";
import {lazy, Suspense} from "react";

import SpiralOverlay from "components/spiral_overlay";
import SpiralSubliminal from "components/spiral_subliminal";

const SpiralCanvas = lazy(() => import("components/spiral_canvas"));

export default function Spiral() {
    return <div className="spiral_container">
        <Suspense fallback={<div className={"subliminal_text"} style={{zIndex: 999}}>Loading...</div>}>
            <SpiralCanvas/>
        </Suspense>
        <SpiralOverlay/>
        <SpiralSubliminal/>
    </div>;
}