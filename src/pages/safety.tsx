import * as React from "react";
import {Breadcrumb, Page, TextBlock} from "components/building_blocks";

export default function AboutSafetyPage() {
    return <Page>
        <Breadcrumb to="/about">About</Breadcrumb>
        <TextBlock>
            This site is designed with safety in mind, but <b>your mind is still your own responsibility</b>
            - always check the subliminal messages before staring at a spiral, and ensure you can escape safely
            if need be.
        </TextBlock>
        <TextBlock>
            As with anything on a screen, staring for too long may cause eye strain - be cautious and take breaks.
        </TextBlock>
        <TextBlock>
            I cannot moderate the spirals created with this site. Spiral settings are stored within the URL of the page.
        </TextBlock>
        <TextBlock>
            Press space, press escape twice, or tap the bottom-right corner of the screen to exit a spiral.
        </TextBlock>
    </Page>
}