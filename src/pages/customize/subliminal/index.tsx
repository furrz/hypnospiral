import * as React from "react";
import {Fragment, useId} from "react";
import {Pencil, TextT, Timer} from "@phosphor-icons/react";
import {useMessageAlpha, useTextWall, useTxtColor} from "state";
import {
    Breadcrumb,
    ColourBox,
    FillGap,
    Label,
    Page,
    Radio,
    RadioOption,
    Slider,
    WideButton
} from "components/building_blocks";
import Previewer from "components/previewer";
import CustomizePage from "pages/customize";

import IconLines from 'assets/LinesText.svg';
import IconWall from 'assets/WallText.svg';

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