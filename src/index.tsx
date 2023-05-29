import * as React from 'react';
import {
    createMemoryRouter,
    Outlet,
    RouterProvider,
    useNavigate,
    useNavigation,
    useNavigationType
} from "react-router-dom";
import {createRoot} from "react-dom/client";
import Homepage from "pages/homepage";
import SpiralPage from "pages/spiral_page";
import FirstTimeSafetyPage from "pages/first_time_safety";
import AboutPage from "pages/about";
import AboutSafetyPage from "pages/safety";
import CustomizePage from "pages/customize";
import CustomizeOverlayPage from "pages/customize/overlay";
import CustomizeSpiralPage from "pages/customize/spiral";
import CustomizeSpiralTimingPage from "pages/customize/spiral/timing";
import CustomizeSubliminalPage from "pages/customize/subliminal";
import CustomizeSubliminalMessagesPage from "pages/customize/subliminal/messages";
import CustomizeSubliminalTimingPage from "pages/customize/subliminal/timing";
import CustomizeSubliminalFontPage from "pages/customize/subliminal/font";

import './style.css';
import {useEffect} from "react";

function HistoryManager() {
    const navType = useNavigationType();
    const navigation = useNavigation();
    const navigate = useNavigate();

    useEffect(() => {
        if (navType === "PUSH") {
            console.log("Push Action");
            window.history.pushState(undefined, undefined);
        }
    }, [navType, navigation]);

    useEffect(() => {
        const handler = () => {
            navigate(-1);
        }

        window.addEventListener("popstate", handler);
        return () => window.removeEventListener("popstate", handler);
    }, [navigate]);

    return <Outlet/>;
}

const routes = [
    {
        element: <HistoryManager/>,
        children: [
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
        ]
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
