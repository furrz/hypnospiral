import * as React from "react";
import {Fragment} from "react";
import CustomizePage from "pages/customize";
import {Breadcrumb, FillGap, Label, Page, TextArea} from "components/building_blocks";
import Previewer from "components/previewer";
import {useMessages} from "state";

export default function CustomizeSubliminalMessagesPage() {
    let [messages, setMessages] = useMessages();
    return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb to="/customize/subliminal" showInBigPrimary>Subliminal Text</Breadcrumb>
            <Label flexExpand>
                subliminal messages
                <TextArea value={messages.join("\n")} onChange={l => setMessages(l.split('\n'))}
                          placeholder={"Write as many subliminal messages as you desire.\n\nOne per line."}/>
            </Label>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>;
};
