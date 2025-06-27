import * as React from 'react'
import { DiscordLogo, Gear, Info, Hand, Play } from '@phosphor-icons/react'
import { BigHeader, BreadcrumbSpace, FillGap, Page, TextBlock, WideButton } from 'components/building_blocks'
import { ShareBtn } from 'components/sharebtn'
import { locStorage } from 'util/local_storage'

const win = (typeof window === 'undefined') ? { location: { hostname: 'hypno.zyntaks.ca' } } : window

export default function Homepage () {
  return (
    <Page>
      <BreadcrumbSpace/>
      <BigHeader>
        hypnospiral<br/><b>visualizer</b>.
      </BigHeader>
      <WideButton primary to={locStorage.getItem('has-seen-safety') === null ? '/first-time-safety' : '/spiral'}>
        begin hypnosis
        <Play weight="bold"/>
      </WideButton>
      <WideButton to="/customize">
        customize spiral
        <Gear weight="bold"/>
      </WideButton>
      <ShareBtn/>
      <WideButton to="/about">
        about
        <Info weight="bold"/>
      </WideButton>
      <a href="https://discord.gg/ZbyerBhmAC" className="wide_button">
        discord
        <DiscordLogo weight="bold"/>
      </a>
      <a href="https://forms.gle/Uir7Wk1jezxyoSMX8" className="wide_button patron_button">
        <div className="patron_button_inner">
          Poll: Improve HSV!
          <Hand weight="bold"/>
        </div>
        <div>
          Tell me how you use the site, and help make it better for everyone!
        </div>
      </a>
      {win.location.hostname !== 'hypno.zyntaks.ca' && win.location.hostname !== 'localhost' &&
        <TextBlock>
          You appear to be on a beta version of the site.
          This could be out of date or unreliable sometimes.

          <a href="#" onClick={e => {
            window.location.href = 'https://hypno.zyntaks.ca/' + window.location.hash
            e.preventDefault()
          }}> Switch to the official release.</a>
        </TextBlock>}
      <FillGap/>
      <TextBlock medium>
        by <a href="https://bsky.app/profile/zyntaks.ca">@zyntaks.ca</a>
      </TextBlock>
    </Page>
  )
}
