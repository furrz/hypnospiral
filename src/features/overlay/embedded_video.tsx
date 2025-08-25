import * as React from 'react'
import { parseMediaUrl } from './media_url_parsing'

const embedAllows = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

export function EmbeddedVideo ({ muted, url, style, className }: {
  muted: boolean
  url: string
  style: object
  className?: string | undefined
}) {
  const mediaInfo = parseMediaUrl(url)

  switch (mediaInfo.type) {
    case 'raw':
      return <video autoPlay loop muted={muted} className={className} key={mediaInfo.url} style={{
        pointerEvents: 'none',
        ...style
      }}>
        <source src={url}/>
      </video>
    case 'youtube': {
      const ctlUrl = `https://www.youtube.com/embed/${mediaInfo.youTubeId}?controls=0&autoplay=1&loop=1&playlist=${mediaInfo.youTubeId}&mute=${muted ? 1 : 0}`

      return <div>
        <iframe className={className}
                src={ctlUrl}
                key={ctlUrl}
                title="YouTube video player"
                allow={embedAllows}
                allowFullScreen
                style={{ pointerEvents: 'none', border: 0, ...style }}></iframe>
      </div>
    }
    case 'soundcloud': {
      const ctlUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(mediaInfo.soundcloudUrl)}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`

      return <div>
        <iframe width="100%" height="166" scrolling="no" frameBorder="no"
                allow={embedAllows}
                src={ctlUrl}
                style={{ opacity: 0, position: 'fixed', pointerEvents: 'none' }}
        ></iframe>
      </div>
    }
    default:
      return <></>
  }
}
