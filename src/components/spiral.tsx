import * as React from 'react'
import { lazy, Suspense } from 'react'

import SpiralOverlay from 'features/overlay/component'
import SpiralSubliminal from 'features/subliminal/component'

const SpiralCanvas = lazy(async () => await import('features/spiral_canvas/component'))

export default function Spiral () {
  return <div className="spiral_container">
        <Suspense fallback={<div className={'subliminal_text'} style={{ zIndex: 999 }}>Loading...</div>}>
            <SpiralCanvas/>
        </Suspense>
        <SpiralOverlay/>
        <SpiralSubliminal/>
    </div>
}
