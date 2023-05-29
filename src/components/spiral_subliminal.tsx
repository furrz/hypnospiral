import * as React from "react";
import {colord} from "colord";
import {useCutomGoogleFont, useMessageAlpha, useTextWall, useTxtColor} from "state";

export default function SpiralSubliminal() {
    let [textWall] = useTextWall();
    let [googleFont] = useCutomGoogleFont();
    let [txtColor] = useTxtColor();
    let [txtAlpha] = useMessageAlpha();
    return <div className={"subliminal_text" + (textWall ? " wall" : "")} style={{
        fontFamily: googleFont || "",
        color: colord({a: txtAlpha, ...txtColor }).toRgbString()
    }}>
        Sample Text
    </div>;
}