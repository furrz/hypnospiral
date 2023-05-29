import {Fragment, useId, useState} from "react";
import CustomizePage from "./customizepage";
import {
    Breadcrumb,
    ColourBox,
    FillGap,
    Label,
    Page,
    Slider,
    TextArea,
    TextBlock,
    TextBox,
    WideButton
} from "../building_blocks";
import {Pencil, Timer} from "@phosphor-icons/react";
import Previewer from "../previewer";
import * as React from "react";
import {useCutomGoogleFont} from "../state";

export default function CustomizeSubliminalFontPage() {
    let [font, setFont] = useCutomGoogleFont();
    return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb to="/customize/subliminal" showInBigPrimary>Subliminal Text</Breadcrumb>
            <Label>
                custom font name
                <TextBox value={font} onChange={setFont}
                          placeholder={"Roboto"}/>
            </Label>
            <TextBlock>
                The name above must exactly match the name of a font from <a href="https://fonts.google.com">Google Fonts</a>.
                If you get the name wrong, your custom font will not appear in the spiral view.
            </TextBlock>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>;
};
