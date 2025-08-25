import * as React from 'react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { BigHeader, Breadcrumb, Checkbox, FillGap, Page, TextBlock } from 'components/building_blocks'

export default function AboutPage () {
  const [dyslexia, setDyslexia] = useLocalStorage('dyslexic', false)

  return <Page>
    <Breadcrumb>Main Menu</Breadcrumb>
    <BigHeader>
      hypnospiral<br/><b>visualizer</b>.
    </BigHeader>
    <TextBlock medium>by <a href="https://bsky.app/profile/zyntaks.ca">@zyntaks.ca</a></TextBlock>
    <TextBlock medium>source code <a href="https://github.com/furrz/hypnospiral">furrz/hypnospiral</a></TextBlock>
    <TextBlock medium><Link to="/about/safety">important safety information</Link></TextBlock>
    <Checkbox value={dyslexia} onChange={v => setDyslexia(v)}>
      dyslexia-friendly font
    </Checkbox>
    <FillGap/>
    <TextBlock>Click or tap on the top half of the spiral to enter fullscreen mode.</TextBlock>
    <TextBlock>Press space, press escape twice, or tap the bottom-right corner of the screen to exit a
      spiral.</TextBlock>
  </Page>
};
