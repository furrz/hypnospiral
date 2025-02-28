import * as React from 'react'
import { Fragment } from 'react'
import { useAudioSource, useBgImage, useBgImageAlpha, useMuteOverlay } from './state'
import { Breadcrumb, Checkbox, FillGap, Label, Page, Slider, TextBlock, TextBox } from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'

export default function CustomizeOverlayPage () {
  const [url, setUrl] = useBgImage()
  const [opacity, setOpacity] = useBgImageAlpha()
  const [muteOverlay, setMuteOverlay] = useMuteOverlay()
  const [audioUrl, setAudioUrl] = useAudioSource()

  return <Fragment>
    <CustomizePage secondary/>
    <Page primary>
      <Breadcrumb>Customizer</Breadcrumb>
      <Label>
        overlay url
        <TextBox placeholder="https://example.com/image.png" value={url} onChange={setUrl}/>
      </Label>
      <Label value={opacity}>
        overlay opacity
        <Slider value={opacity} onChange={setOpacity}/>
      </Label>
      <Checkbox value={muteOverlay} onChange={setMuteOverlay}>use separate audio</Checkbox>
      {muteOverlay && <Label>
        audio source URL
        <TextBox placeholder="https://youtube.com/watch?v=jsnkdjnd" value={audioUrl} onChange={setAudioUrl}/>
      </Label>}
      <TextBlock medium>
        The overlay url <b>must</b> link to an image, video, or audio <b>file</b>, or a YouTube video or
        SoundCloud song that has embedding enabled.
        Some media cannot be embedded.
        A proper file link usually ends in .png, .jpg, .mp4, .mp3, etc.
      </TextBlock>
      <TextBlock>
        <b>Links to imgur albums, FA posts, etc. will NOT work directly.</b>
      </TextBlock>
      <FillGap/>
      <Previewer/>
    </Page>
  </Fragment>
};
