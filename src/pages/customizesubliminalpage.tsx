import {Breadcrumb, ColourBox, FillGap, Label, Page, Radio, RadioOption, Slider, WideButton} from "../building_blocks";
import * as React from "react";
import Previewer from "../previewer";
import CustomizePage from "./customizepage";
import {Fragment, useId, useState} from "react";
import {Pencil, TextT, Timer} from "@phosphor-icons/react";

import IconLines from '../assets/LinesText.svg';
import IconWall from '../assets/WallText.svg';
import {useMessageAlpha, useTextWall, useTxtColor} from "../state";

export default function CustomizeSubliminalPage() {
    let opacitySliderId = useId();
    let [useWall, setUseWall] = useTextWall();
    let [opacity, setOpacity] = useMessageAlpha();
    let [colour, setColour] = useTxtColor();

    return <Fragment>
        <CustomizePage secondary/>
        <Page primary>
            <Breadcrumb to="/customize">Customizer</Breadcrumb>
            <Label>
                text mode
                <Radio value={useWall ? "wall" : "lines"} onChange={v => setUseWall(v === "wall")}>
                    <RadioOption value="wall"><IconWall/></RadioOption>
                    <RadioOption value="lines"><IconLines/></RadioOption>
                </Radio>
            </Label>
            <Label value={opacity} htmlFor={opacitySliderId}>
                colour + opacity
            </Label>
            <div className="input_row standalone_input">
                <ColourBox value={colour} onChange={setColour}/>
                <Slider value={opacity} onChange={setOpacity} id={opacitySliderId}/>
            </div>
            <WideButton to="/customize/subliminal/messages">
                edit messages
                <Pencil weight="bold"/>
            </WideButton>
            <WideButton to="/customize/subliminal/timing">
                timing + order
                <Timer weight="bold"/>
            </WideButton>
            <WideButton to="/customize/subliminal/font">
                custom font
                <TextT weight="bold"/>
            </WideButton>
            <FillGap/>
            <Previewer/>
        </Page>
    </Fragment>;
}