import * as React from "react";
import {colord} from "colord";
import {useCutomGoogleFont, useMessageAlpha, useTextWall, useTxtColor} from "state";
import {Fragment} from "react";

export default function SpiralSubliminal() {
    let [textWall] = useTextWall();
    let [googleFont] = useCutomGoogleFont();
    let [txtColor] = useTxtColor();
    let [txtAlpha] = useMessageAlpha();

    let [fontFamily, fontWeight] = (googleFont || "").trim().split(":", 2);
    if (!fontWeight) fontWeight = "400";
    let fontItalic = fontWeight.startsWith("i");
    if (fontItalic) fontWeight = fontWeight.substring(1);
    if (fontWeight === "") fontWeight = "400";

    return <Fragment>
        <link rel="stylesheet" href={"https://fonts.googleapis.com/css?family=" + googleFont}/>
        <div className={"subliminal_text" + (textWall ? " wall" : "")} style={{
            fontFamily,
            fontWeight,
            fontStyle: fontItalic ? "italic" : "normal",
            color: colord({a: txtAlpha, ...txtColor}).toRgbString()
        }}>
            Sample Text
        </div>
    </Fragment>;
}