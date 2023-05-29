import * as React from "react";
import {Fragment} from "react";
import CustomizePage from "pages/customize";
import {
    Breadcrumb,
    FillGap,
    Label,
    Page,
    TextBlock,
    TextBox
} from "components/building_blocks";
import Previewer from "components/previewer";
import {useCutomGoogleFont} from "state";

export default function CustomizeSubliminalFontPage() {
    let [font, setFont] = useCutomGoogleFont();
    return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb showInBigPrimary>Subliminal Text</Breadcrumb>
            <Label>
                custom font name
                <TextBox value={font} onChange={setFont}
                         placeholder={"Roboto"}/>
            </Label>
            <TextBlock>
                The name above must exactly match the name of a font from <a href="https://fonts.google.com">Google
                Fonts</a>.
                If you get the name wrong, your custom font will not appear in the spiral view.
            </TextBlock>
            <TextBlock>
                Want a font to be bold? Even bolder? You can add a font weight,
                e.g.: <code>Roboto:bold</code>, <code>Roboto:light</code>, <code>Roboto:800</code>.
            </TextBlock>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>;
};
