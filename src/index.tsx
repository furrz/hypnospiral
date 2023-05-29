import * as React from 'react';
import {createMemoryRouter, RouterProvider} from "react-router-dom";
import {createRoot} from "react-dom/client";
import Homepage from "./pages/homepage";
import SpiralPage from "./pages/spiralpage";
import FirstTimeSafetyPage from "./pages/firsttimesafetypage";
import CustomizePage from "./pages/customizepage";
import AboutPage from "./pages/aboutpage";
import AboutSafetyPage from "./pages/aboutsafetypage";
import CustomizeSpiralPage from "./pages/customizespiralpage";
import CustomizeSubliminalPage from "./pages/customizesubliminalpage";
import CustomizeOverlayPage from "./pages/customizeoverlaypage";
import CustomizeSubliminalMessagesPage from "./pages/customizesubliminalmessagespage";
import CustomizeSubliminalTimingPage from "./pages/customizesubliminaltimingpage";
import CustomizeSpiralTimingPage from "./pages/customizespiraltimingpage";
import CustomizeSubliminalFontPage from "./pages/customizesubliminalfontpage";

const routes = [
    {
        path: "/",
        element: <Homepage/>
    },
    {
        path: "/spiral",
        element: <SpiralPage/>
    },
    {
        path: "/first-time-safety",
        element: <FirstTimeSafetyPage/>
    },
    {
        path: "/customize",
        element: <CustomizePage/>
    },
    {
        path: "/customize/spiral",
        element: <CustomizeSpiralPage/>
    },
    {
        path: "/customize/spiral/timing",
        element: <CustomizeSpiralTimingPage/>
    },
    {
        path: "/customize/subliminal",
        element: <CustomizeSubliminalPage/>
    },
    {
        path: "/customize/subliminal/messages",
        element: <CustomizeSubliminalMessagesPage/>
    },
    {
        path: "/customize/subliminal/timing",
        element: <CustomizeSubliminalTimingPage/>
    },
    {
        path: "/customize/subliminal/font",
        element: <CustomizeSubliminalFontPage/>
    },
    {
        path: "/customize/overlay",
        element: <CustomizeOverlayPage/>
    },
    {
        path: "/share"
    },
    {
        path: "/about",
        element: <AboutPage/>
    },
    {
        path: "/about/safety",
        element: <AboutSafetyPage/>
    }
];

const router = createMemoryRouter(routes, {
    initialEntries: ["/"],
    initialIndex: 1
});


const appElem = document.querySelector('#app');
if (navigator.userAgent.indexOf('AppleWebKit') != -1) {
    appElem.classList.add("is_webkit");
}
const root = createRoot(appElem);
root.render(<RouterProvider router={router}/>);
