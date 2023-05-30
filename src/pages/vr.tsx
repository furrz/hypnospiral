import * as React from "react";
import {Breadcrumb, Page, TextBlock} from "components/building_blocks";
import {useEffect, useState} from "react";

export default function VrPage() {

    const [xrError, setXrError] = useState(null as string);
    const [session, setSession] = useState(null as XRSession);

    useEffect(() => {
        if (!session) return;

        const glCanvas = document.createElement("canvas");
        const gl = glCanvas.getContext("webgl2", { xrCompatible: true });
        let refSpace : XRReferenceSpace = null;

        session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) })?.catch(console.error);

        session.requestReferenceSpace("viewer").then((newRefSpace) => {
            refSpace = newRefSpace;
            session.requestAnimationFrame(sessionFrame);
        });

        session.addEventListener("end", () => {
            setXrError("The VR session has ended.");
            setSession(null);
        });

        const sessionFrame = (t: DOMHighResTimeStamp, frame: XRFrame) => {
            let pose = frame.getViewerPose(refSpace);
            if(pose) {
                let glLayer = session.renderState.baseLayer;

                gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
                gl.clearColor(0.4, 0.7, 0.9, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                for(let view of pose.views) {
                    let viewport = glLayer.getViewport(view);
                    gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

                    // Here we will draw our scenes
                }
            }

            session?.requestAnimationFrame(sessionFrame);
        }

        return () => {
            session?.end().catch(console.error);
            glCanvas.remove();
        };
    }, [session]);

    const doSessionRequest = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.xr.requestSession("immersive-vr").then(setSession).catch(e => {
            console.error(e);
            setXrError("Unable to start a VR session.");
        })
    };

    return <Page>
        <Breadcrumb>Main Menu</Breadcrumb>
        {xrError ? <TextBlock medium>{xrError}</TextBlock> : <a href="#" onClick={doSessionRequest}>Start VR</a> }
    </Page>
}