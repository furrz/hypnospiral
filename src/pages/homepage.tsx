import * as React from 'react'
import { DiscordLogo, Gear, Info, Confetti, Play } from '@phosphor-icons/react'
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
      <a href="https://www.youtube.com/@blenderbenderthethird544"
         target="_blank" rel="noreferrer"
         className="wide_button patron_button">
        <div className="patron_button_inner">
          big update!
          <Confetti weight="bold"/>
        </div>
        <div>
          Thank you to BB3 for fixing build issues and adding new features!
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
