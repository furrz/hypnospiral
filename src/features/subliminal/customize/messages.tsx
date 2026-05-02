import * as React from 'react'
import { Fragment } from 'react'
import CustomizePage from 'pages/customize'
import { Breadcrumb, FillGap, Label, Page, TextArea, CollapsibleSection, Tag } from 'components/building_blocks'
import Previewer from 'components/previewer'
import { useMessages, useWritingMode, useTextWall, useRsvp, useOneWord, useRandomOrder } from '../state'

export default function CustomizeSubliminalMessagesPage () {
  const [messages, setMessages] = useMessages()
  const [writingMode] = useWritingMode()
  const [textWall] = useTextWall()
  const [rsvp] = useRsvp()
  const [oneWord] = useOneWord()
  const [randomOrder] = useRandomOrder()
  return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb showInBigPrimary>Subliminal Text</Breadcrumb>
            <CollapsibleSection title="available tags">
                <ul>
                    {(!textWall && (!randomOrder || rsvp)) && <li><Tag tag={'{state:x}'} min={0} max={12} description="change the state of the spiral"/></li>}
                    {!textWall && <li><Tag tag={'{color:r,g,b}'} min={0} max={255} description="change the text color for the line"/></li>}
                    {!textWall && <li><Tag tag={'{wait:x}'} min={0.000} max={9.999} description="change the duration of the line"/></li>}
                    {!textWall && <li><Tag tag={'{gap:x}'} min={0.000} max={9.999} description="change the duration of the line gap"/></li>}
                    {!textWall && <li><Tag tag={'{fontScale:x}'} min={0.000} max={9.999} description="change the font scale of the line"/></li>}
                    {(!textWall && (!randomOrder || rsvp)) && <li><Tag tag={'{begin-repeat}'} description="start a repeating section"/></li>}
                    {(!textWall && (!randomOrder || rsvp)) && <li><Tag tag={'{begin-repeat-random}'} description="start a repeating section, randomizing the order of repeated lines"/></li>}
                    {(!textWall && (!randomOrder || rsvp)) && <li><Tag tag={'{repeat:x}'} min={1} max={99} description="repeat a section x times, starting from the furthest begin-repeat tag"/></li>}
                    {(!writingMode && !textWall && !rsvp) && <li><Tag tag={'{write}'} description="this line must be typed out"/></li>}
                    {rsvp && <li><Tag tag={'{speed:x}'} min={60} max={600} description='sets the rate of words per minute at that point, speed will linearly interpolate to the tag from the previous speed tag or starting speed'/></li>}
                    {oneWord && !textWall && !rsvp && <li>for tags to work with single word mode, the tag must be directly next to the word and will not apply to the whole line</li>}
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
