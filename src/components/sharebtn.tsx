import * as React from "react";
import {Clipboard, Share, Warning} from "@phosphor-icons/react";
import toast, {Toaster} from "react-hot-toast";

export const ShareBtn = function () {
    const handleShare = (e: React.MouseEvent) => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            toast("Copied to Clipboard", {
                icon: <Clipboard weight="bold"/>
            });
        }).catch(() => {
            toast("Unable to Copy Link", {
                icon: <Warning weight="bold"/>
            })
        });

        e.preventDefault();
    };

    return <a href="#" onClick={handleShare} className="wide_button">
        share spiral
        <Share weight="bold"/>
        <Toaster toastOptions={{
            className: 'toast',
            style: {
                color: "var(--bg-color)",
                background: "var(--accent-color)"
            }
        }}/>
    </a>;
};
