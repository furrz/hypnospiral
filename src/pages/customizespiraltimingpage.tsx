import {Fragment, useState} from "react";
import CustomizePage from "./customizepage";
import {Breadcrumb, FillGap, Label, Page, Slider} from "../building_blocks";
import Previewer from "../previewer";
import * as React from "react";
import {useSpinSpeed, useThrobSpeed, useThrobStrength, useZoom} from "../state";

export default function CustomizeSpiralTimingPage() {
    const [spinSpeed, setSpinSpeed] = useSpinSpeed();
    const [throbSpeed, setThrobSpeed] = useThrobSpeed();
    const [throbStrength, setThrobStrength] = useThrobStrength();
    const [zoom, setZoom] = useZoom();

    return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb to="/customize/spiral" showInBigPrimary>Spiral Style</Breadcrumb>
            <Label value={spinSpeed}>
                spin speed
                <Slider value={spinSpeed} onChange={setSpinSpeed} max={4}/>
            </Label>
            <Label value={throbSpeed}>
                throb speed
                <Slider value={throbSpeed} onChange={setThrobSpeed} max={4}/>
            </Label>
            <Label value={throbStrength}>
                throb strength
                <Slider value={throbStrength} onChange={setThrobStrength} max={4}/>
            </Label>
            <Label value={zoom}>
                zoom
                <Slider value={zoom} onChange={setZoom} max={4}/>
            </Label>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>;
};
