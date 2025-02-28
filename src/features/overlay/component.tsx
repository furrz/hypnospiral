import * as React from 'react'
import { useAudioSource, useBgImage, useBgImageAlpha, useMuteOverlay } from './state'
import { EmbeddedVideo } from './embedded_video'

export default function SpiralOverlay () {
  const [url] = useBgImage()
  const [alpha] = useBgImageAlpha()
  const [muteOverlay] = useMuteOverlay()
  const [audioUrl] = useAudioSource()

  return <div>
    <div className="spiral_overlay" style={{
      backgroundImage: `url(${url})`,
      opacity: alpha.toString()
    }}></div>
    <EmbeddedVideo muted={muteOverlay} url={url} style={{ opacity: alpha.toString() }}
                   className="spiral_video_overlay"/>
    {muteOverlay && <EmbeddedVideo muted={false} url={audioUrl} style={{ opacity: 0, position: 'fixed' }}/>}
  </div>
}
