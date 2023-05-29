import {Breadcrumb, ColourBox, FillGap, Label, Page, Radio, RadioOption, WideButton} from "../building_blocks";
import * as React from "react";
import Previewer from "../previewer";
import {Fragment, useState} from "react";
import CustomizePage from "./customizepage";

import IconSpiral from "../assets/SpiralStyle.svg";
import IconCircle from "../assets/CirclesStyle.svg";
import {Timer} from "@phosphor-icons/react";
import {useBgColor, useFgColor, useSpiralMode} from "../state";

export default function CustomizeSpiralPage () {
    let [spiralMode, setSpiralMode] = useSpiralMode();
    let [bgColor, setBgColor] = useBgColor();
    let [fgColor, setFgColor] = useFgColor();

    return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb to="/customize">Customizer</Breadcrumb>
            <Label>
                spiral type
                <Radio value={spiralMode} onChange={setSpiralMode}>
                    <RadioOption value="spiral"><IconSpiral/></RadioOption>
                    <RadioOption value="circle"><IconCircle/></RadioOption>
                </Radio>
            </Label>
            <Label>
                colours
                <ColourBox value={bgColor} onChange={setBgColor}/>
                <ColourBox value={fgColor} onChange={setFgColor}/>
            </Label>
            <WideButton to="/customize/spiral/timing">
                motion + timing
                <Timer weight="bold"/>
            </WideButton>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>;
}