import * as React from "react";
import {useBgImage, useBgImageAlpha} from "./state";

export default function SpiralOverlay() {
    const [url] = useBgImage();
    const [alpha] = useBgImageAlpha();

    return <div>
        <div className="spiral_overlay" style={{
            backgroundImage: `url(${url})`,
            opacity: alpha.toString()
        }}></div>
        <video autoPlay loop className="spiral_video_overlay" style={{
            opacity: alpha.toString()
        }}>
            <source src={url}/>
        </video>
    </div>;
}