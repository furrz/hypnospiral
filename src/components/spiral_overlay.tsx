import * as React from 'react'
import { useBgImage, useBgImageAlpha, useMuteOverlay } from 'state'

const ytVideoIDRegex = /^[a-zA-Z0-9]{11}$/

export default function SpiralOverlay () {
  const [url] = useBgImage()
  const [alpha] = useBgImageAlpha()
  const [muteOverlay] = useMuteOverlay()

  let ytVideoID: string | null = null

  try {
    const parsedURL = new URL(url)

    // Check if the URL is a YouTube link
    if ((parsedURL.hostname === 'youtube.com' || parsedURL.hostname === 'www.youtube.com') && parsedURL.pathname === '/watch') {
      ytVideoID = parsedURL.searchParams.get('v')
    } else if (parsedURL.hostname === 'youtu.be' || parsedURL.hostname === 'www.youtu.be') {
      ytVideoID = parsedURL.pathname.split('/')[1]
    }

    // Only valid YouTube video IDs will be interpreted as a YT video
    if (ytVideoID !== null && ytVideoIDRegex.test(ytVideoID)) {
      return <div>
        <iframe className="spiral_video_overlay"
                src={`https://www.youtube.com/embed/${ytVideoID}?controls=0&autoplay=1&loop=1&playlist=${ytVideoID}&mute=${muteOverlay ? 1 : 0}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ opacity: alpha.toString(), pointerEvents: 'none', border: 0 }}></iframe>
      </div>
    }
  } catch (e) {
  }

  return <div>
    <div className="spiral_overlay" style={{
      backgroundImage: `url(${url})`,
      opacity: alpha.toString()
    }}></div>
    <video autoPlay loop muted={muteOverlay} className="spiral_video_overlay" key={url} style={{
      opacity: alpha.toString()
    }}>
      <source src={url}/>
    </video>
  </div>
}
