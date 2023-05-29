import {NavLink} from "react-router-dom";
import * as React from "react";
import {Play} from "@phosphor-icons/react";
import {useState} from "react";
import Spiral from "./spiral";
import {createState} from "state-pool";

const previewState = createState(false);

export default function Previewer() {
    let [doPreview, setDoPreview] = previewState.useState();

    return <div
        className="preview_box hide_when_big_primary"
        onClick={() => setDoPreview(!doPreview)}>
        {doPreview ? <Spiral/> : <div className="preview_inactive_text">tap to toggle preview</div>}
    </div>;
}