export interface MediaYouTube {
  type: 'youtube'
  youTubeId: string
}

export interface MediaSoundcloud {
  type: 'soundcloud'
  soundcloudUrl: string
}

export interface MediaRaw {
  type: 'raw'
  url: string
}

export interface MediaNone {
  type: 'none'
}

export type MediaResult = MediaNone | MediaYouTube | MediaSoundcloud | MediaRaw

const youtubeWatchHostnames = ['youtube.com', 'www.youtube.com']
const youtubeShortLinkHostnames = ['youtu.be', 'www.youtu.be']
const soundcloudHostnames = ['soundcloud.com', 'www.soundcloud.com', 'on.soundcloud.com', 'www.on.soundcloud.com']

export function parseMediaUrl (url: string): MediaResult {
  try {
    const parsedUrl = new URL(url)

    if (youtubeWatchHostnames.includes(parsedUrl.hostname) && parsedUrl.pathname === '/watch') {
      return ytVideoIdToMediaResult(parsedUrl.searchParams.get('v'))
    } else if (youtubeShortLinkHostnames.includes(parsedUrl.hostname)) {
      return ytVideoIdToMediaResult(parsedUrl.pathname.split('/')[1])
    } else if (soundcloudHostnames.includes(parsedUrl.hostname)) {
      return scAudioLinkToMediaResult(url)
    } else {
      return {
        type: 'raw',
        url
      }
    }
  } catch (e) {
    return { type: 'none' }
  }
}

const ytVideoIdRegex = /^[a-zA-Z0-9_-]{11}$/
function ytVideoIdToMediaResult (ytVideoId: string | null): MediaResult {
  if (ytVideoId !== null && ytVideoIdRegex.test(ytVideoId)) {
    return {
      type: 'youtube',
      youTubeId: ytVideoId
    }
  }

  return { type: 'none' }
}

function scAudioLinkToMediaResult (scAudioLink: string): MediaResult {
  return {
    type: 'soundcloud',
    soundcloudUrl: scAudioLink
  }
}
