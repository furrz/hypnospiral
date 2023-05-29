import * as React from "react";
import {colord} from "colord";
import {useCutomGoogleFont, useMessageAlpha, useTextWall, useTxtColor} from "state";
import {Fragment} from "react";

export default function SpiralSubliminal() {
    let [textWall] = useTextWall();
    let [googleFont] = useCutomGoogleFont();
    let [txtColor] = useTxtColor();
    let [txtAlpha] = useMessageAlpha();

    return <Fragment>
        <link rel="stylesheet" href={"https://fonts.googleapis.com/css?family=" + googleFont}/>
        <div className={"subliminal_text" + (textWall ? " wall" : "")} style={{
        fontFamily: (googleFont || "").split(":", 1)[0],
        fontWeight: (googleFont || "").split(":")[2] || "200",
        color: colord({a: txtAlpha, ...txtColor }).toRgbString()
    }}>
        Sample Text
        </div>
    </Fragment>;
}