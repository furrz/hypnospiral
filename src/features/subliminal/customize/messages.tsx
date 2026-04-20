import * as React from 'react'
import { Fragment } from 'react'
import CustomizePage from 'pages/customize'
import { Breadcrumb, FillGap, Label, Page, TextArea, CollapsibleSection, Tag } from 'components/building_blocks'
import Previewer from 'components/previewer'
import { useMessages, useWritingMode, useTextWall, useRsvp, useOneWord } from '../state'

export default function CustomizeSubliminalMessagesPage () {
  const [messages, setMessages] = useMessages()
  const [writingMode] = useWritingMode()
  const [textWall] = useTextWall()
  const [rsvp] = useRsvp()
  const [oneWord] = useOneWord()
  return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb showInBigPrimary>Subliminal Text</Breadcrumb>
            <CollapsibleSection title="available tags">
                <ul>
                    {(!textWall && !rsvp) && <>
                        <li><Tag tag={'{color:r,g,b}'} min={0} max={255} description="change the text color for the line"/></li>
                        <li><Tag tag={'{wait:x}'} min={0.000} max={9.999} description="change the duration of the line"/></li>
                        <li><Tag tag={'{fontScale:x}'} min={0.000} max={9.999} description="change the font scale of the line"/></li>
                        </>}
                    {!writingMode && !textWall && !rsvp &&
                        <li><Tag tag={'{write}'} description="this line must be typed out"/></li>}
                    {rsvp && <li><Tag tag={'{speed:x}'} min={60} max={600} description='sets the rate of words per minute at that point, speed will linearly interpolate to the tag from the previous speed tag or starting speed'/></li>}
                    {oneWord && <li>for tags to work with single word mode, the tag must be directly next to the word and will not apply to the whole line</li>}
                    {textWall && <li>no tags available for this text mode</li>}
                </ul>
            </CollapsibleSection>
            <Label flexExpand>
                subliminal messages
                <TextArea value={messages.join('\n')}
                          onChange={l => { setMessages(l.split('\n')) }}
                          placeholder={'Write as many subliminal messages as you desire.\n\nOne per line.'}/>
            </Label>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>
};
