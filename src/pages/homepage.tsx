import * as React from 'react';
import {Gear, Info, Play, Share} from "@phosphor-icons/react";
import {BigHeader, BreadcrumbSpace, FillGap, Page, TextBlock, WideButton} from "../building_blocks";
import {ShareBtn} from "../sharebtn";

export default function Homepage() {
    return (
        <Page>
            <BreadcrumbSpace/>
            <BigHeader>
                hypnospiral<br/><b>visualizer</b>.
            </BigHeader>
            <WideButton primary to={localStorage.getItem("has-seen-safety") === null ? "/first-time-safety" : "/spiral"}>
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
            <FillGap/>
            <TextBlock medium>
                by <a href="https://twitter.com/PrinceZyntaks">@PrinceZyntaks</a>
            </TextBlock>
        </Page>
    );
}
