import * as React from 'react'
import { Fragment } from 'react'
import { useBgImage, useBgImageAlpha, useMuteOverlay } from 'state'
import { Breadcrumb, Checkbox, FillGap, Label, Page, Slider, TextBlock, TextBox } from 'components/building_blocks'
import Previewer from 'components/previewer'
import CustomizePage from 'pages/customize'

export default function CustomizeOverlayPage () {
  const [url, setUrl] = useBgImage()
  const [opacity, setOpacity] = useBgImageAlpha()
  const [muteOverlay, setMuteOverlay] = useMuteOverlay()

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
      <Checkbox value={muteOverlay} onChange={setMuteOverlay}>Mute Overlay Video</Checkbox>
      <TextBlock medium>
        The overlay url <b>must</b> link to an image or video <b>file</b>, or to a YouTube video.
        Some videos cannot be embedded.
        A proper file link usually ends in .png, .jpg, .mp4, etc.
      </TextBlock>
      <TextBlock>
        <b>Links to imgur albums, FA posts, etc. will NOT work directly.</b>
      </TextBlock>
      <TextBlock>
        <b>If you only want the audio from a video, simply set overlay opacity to 0.00.</b>
      </TextBlock>
      <FillGap/>
      <Previewer/>
    </Page>
  </Fragment>
};
