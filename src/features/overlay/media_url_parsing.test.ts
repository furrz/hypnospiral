import { describe, expect, it } from 'vitest'
import {
  type MediaNone,
  type MediaRaw,
  type MediaSoundcloud,
  type MediaYouTube,
  parseMediaUrl
} from './media_url_parsing'

describe('parseMediaUrl', () => {
  it('parses simple youtube links correctly', () => {
    expect(parseMediaUrl('https://www.youtube.com/watch?v=hgswU9w8p04&playlist=e&utm=219#mess')).toStrictEqual({
      type: 'youtube',
      youTubeId: 'hgswU9w8p04'
    } satisfies MediaYouTube)
  })

  it('parses youtu.be links correctly', () => {
    expect(parseMediaUrl('https://youtu.be/FcWsqJRWO1Q?si=lKmZvG2JvlIinbxE')).toStrictEqual({
      type: 'youtube',
      youTubeId: 'FcWsqJRWO1Q'
    } satisfies MediaYouTube)
  })

  it('rejects invalid youtube video IDs', () => {
    expect(parseMediaUrl('https://youtu.be/FcWsq199RWO1Q?si=lKmZvG2JvlIinbxE')).toStrictEqual({
      type: 'none'
    } satisfies MediaNone)
  })

  it('parses soundcloud links correctly', () => {
    expect(parseMediaUrl('https://soundcloud.com/videogameremixes/mii-channel-remix?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing')).toStrictEqual({
      type: 'soundcloud',
      soundcloudUrl: 'https://soundcloud.com/videogameremixes/mii-channel-remix?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing'
    } satisfies MediaSoundcloud)
  })

  it('rejects invalid URLs', () => {
    expect(parseMediaUrl('fo//cor-._cor/12.pee')).toStrictEqual({
      type: 'none'
    } satisfies MediaNone)
  })

  it('accepts valid URLs', () => {
    expect(parseMediaUrl('https://example.com/foo.mp3')).toStrictEqual({
      type: 'raw',
      url: 'https://example.com/foo.mp3'
    } satisfies MediaRaw)
  })
})
