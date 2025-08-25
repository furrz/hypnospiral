import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Play } from '@phosphor-icons/react'
import { BigHeader, Breadcrumb, FillGap, Page, TextBlock, WideButton } from 'components/building_blocks'

export default function FirstTimeSafetyPage () {
  return <Page>
    <Breadcrumb>Main Menu</Breadcrumb>
    <BigHeader>
      hypnospiral<br/>
      <b>safety</b>alizer.
    </BigHeader>
    <TextBlock medium><NavLink to="/about/safety">More Safety Information</NavLink></TextBlock>
    <TextBlock medium>
      We&apos;ll only force you to read this once, but it&apos;s available in <i>about</i> anytime.
    </TextBlock>
    <TextBlock medium>
      <b>Tap in the bottom-right corner of the screen to escape the spiral.</b>
    </TextBlock>
    <TextBlock medium>
      <b>You can check the subliminal text in this spiral from the customize spiral screen.</b>
    </TextBlock>
    <FillGap/>
    <WideButton primary to="/spiral">
      no really, begin hypnosis
      <Play weight="bold"/>
    </WideButton>
  </Page>
}
