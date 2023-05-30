import * as React from 'react';
import {Gear, Info, Play, VirtualReality} from "@phosphor-icons/react";
import {BigHeader, BreadcrumbSpace, FillGap, Page, TextBlock, WideButton} from "components/building_blocks";
import {ShareBtn} from "components/sharebtn";
import {useEffect, useState} from "react";

export default function Homepage() {
    const [vrSupported, setVrSupported] = useState(false);

    useEffect(() => {
        if (navigator.xr) {
            const checkXrSupport = () => {
                navigator.xr.isSessionSupported("immersive-vr").then(setVrSupported);
            };


            checkXrSupport();
            navigator.xr.addEventListener("devicechange", checkXrSupport);

            return () => { navigator.xr.removeEventListener("devicechange", checkXrSupport); };
        }
    }, []);

    return (
        <Page>
            <BreadcrumbSpace/>
            <BigHeader>
                hypnospiral<br/><b>visualizer</b>.
            </BigHeader>
            <WideButton primary
                        to={localStorage.getItem("has-seen-safety") === null ? "/first-time-safety" : "/spiral"}>
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
            {vrSupported &&
                <WideButton to="/vr">
                    vr mode
                    <VirtualReality weight="bold"/>
                </WideButton>}
            {window.location.hostname !== "hypno.zyntaks.ca" && window.location.hostname !== "localhost" &&
                <TextBlock>
                    You appear to be on a beta version of the site.
                    This could be out of date or unreliable sometimes.

                    <a href="#" onClick={e => {
                        window.location.href = "https://hypno.zyntaks.ca/" + window.location.hash;
                        e.preventDefault();
                    }}> Switch to the official release.</a>
                </TextBlock>}
            <FillGap/>
            <TextBlock medium>
                by <a href="https://twitter.com/PrinceZyntaks">@PrinceZyntaks</a>
            </TextBlock>
        </Page>
    );
}
