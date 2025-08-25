import { BigHeader, Breadcrumb, FillGap, Page, WideButton } from 'components/building_blocks'
import * as React from 'react'
import { Gear, StackSimple, TextAa } from '@phosphor-icons/react'
import Previewer from 'components/previewer'
import { ShareBtn } from 'components/sharebtn'

export default function CustomizePage ({ secondary }: { secondary?: boolean }) {
  return <Page secondary={secondary}>
        <Breadcrumb secondary={secondary}>Main Menu</Breadcrumb>
        <BigHeader>
            hypnospiral<br/><b>customizer</b>.
        </BigHeader>
        <WideButton to="/customize/spiral" onSecondaryPage={secondary}>spiral style <Gear weight="bold"/></WideButton>
        <WideButton to="/customize/subliminal" onSecondaryPage={secondary}>subliminal text <TextAa weight="bold"/></WideButton>
        <WideButton to="/customize/overlay" onSecondaryPage={secondary}>overlays & audio <StackSimple weight="bold"/></WideButton>
        <FillGap/>
        <ShareBtn/>
        <Previewer/>
    </Page>
};
