import * as React from 'react'
import { useAudioSource, useBgImage, useBgImageAlpha, useMuteOverlay } from 'state'

const ytVideoIDRegex = /^[a-zA-Z0-9-]{11}$/

function EmbeddedVideo ({ muted, url, style, className }: {
  muted: boolean
  url: string
  style: object
  className?: string | undefined
}) {
  let ytVideoID: string | null = null
  let isScAudioLink: boolean = false

  try {
    const parsedURL = new URL(url)

    // Check if the URL is a YouTube link
    if ((parsedURL.hostname === 'youtube.com' || parsedURL.hostname === 'www.youtube.com') && parsedURL.pathname === '/watch') {
      ytVideoID = parsedURL.searchParams.get('v')
    } else if (parsedURL.hostname === 'youtu.be' || parsedURL.hostname === 'www.youtu.be') {
      ytVideoID = parsedURL.pathname.split('/')[1]
    } else if (parsedURL.hostname === 'soundcloud.com' || parsedURL.hostname === 'www.soundcloud.com' || parsedURL.hostname === 'on.soundcloud.com' || parsedURL.hostname === 'www.on.soundcloud.com') {
      isScAudioLink = true
    }

    // Only valid YouTube video IDs will be interpreted as a YT video
    if (ytVideoID !== null && ytVideoIDRegex.test(ytVideoID)) {
      const ctlUrl = `https://www.youtube.com/embed/${ytVideoID}?controls=0&autoplay=1&loop=1&playlist=${ytVideoID}&mute=${muted ? 1 : 0}`

      return <div>
        <iframe className={className}
                src={ctlUrl}
                key={ctlUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ pointerEvents: 'none', border: 0, ...style }}></iframe>
      </div>
    }
  } catch (e) {
  }

  if (isScAudioLink) {
    const ctlUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`

    return <div>
      <iframe width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay"
              src={ctlUrl}
              style={{ opacity: 0, position: 'fixed', pointerEvents: 'none' }}></iframe>
    </div>
  }

  return <video autoPlay loop muted={muted} className={className} key={url} style={{
    pointerEvents: 'none',
    ...style
  }}>
    <source src={url}/>
  </video>
}

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
