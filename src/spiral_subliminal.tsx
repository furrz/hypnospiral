import * as React from "react";
import {useCutomGoogleFont, useMessageAlpha, useTextWall, useTxtColor} from "./state";
import {colord} from "colord";

export default function SpiralSubliminal() {
    let [textWall] = useTextWall();
    let [googleFont] = useCutomGoogleFont();
    let [txtColor] = useTxtColor();
    let [txtAlpha] = useMessageAlpha();
    return <div className={"subliminal_text" + (textWall ? " wall" : "")} style={{
        fontFamily: googleFont || "",
        color: colord({a: txtAlpha * 255, ...txtColor }).toRgbString()
    }}>
        FUCK
    </div>;
}