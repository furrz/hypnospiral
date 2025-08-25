import * as React from 'react'
import {
  createBrowserRouter, // Changed from createMemoryRouter
  type RouteObject,
  RouterProvider
} from 'react-router-dom'
import Homepage from 'pages/homepage'
import SpiralPage from 'pages/spiral_page'
import FirstTimeSafetyPage from 'pages/first_time_safety'
import CustomizePage from 'pages/customize'
import CustomizeSpiralPage from 'features/spiral_canvas/customize'
import CustomizeSpiralTimingPage from 'features/spiral_canvas/customize/timing'
import CustomizeSubliminalPage from 'features/subliminal/customize'
import CustomizeSubliminalMessagesPage from 'features/subliminal/customize/messages'
import CustomizeSubliminalTimingPage from 'features/subliminal/customize/timing'
import CustomizeSubliminalFontPage from 'features/subliminal/customize/font'
import CustomizeOverlayPage from 'features/overlay/customize'
import AboutPage from 'pages/about'
import AboutSafetyPage from 'pages/safety'

// The HistoryManager component has been removed.

// The routes are now the top-level array, without the wrapper.
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/spiral',
    element: <SpiralPage />
  },
  {
    path: '/first-time-safety',
    element: <FirstTimeSafetyPage />
  },
  {
    path: '/customize',
    element: <CustomizePage />
  },
  {
    path: '/customize/spiral',
    element: <CustomizeSpiralPage />
  },
  {
    path: '/customize/spiral/timing',
    element: <CustomizeSpiralTimingPage />
  },
  {
    path: '/customize/subliminal',
    element: <CustomizeSubliminalPage />
  },
  {
    path: '/customize/subliminal/messages',
    element: <CustomizeSubliminalMessagesPage />
  },
  {
    path: '/customize/subliminal/timing',
    element: <CustomizeSubliminalTimingPage />
  },
  {
    path: '/customize/subliminal/font',
    element: <CustomizeSubliminalFontPage />
  },
  {
    path: '/customize/overlay',
    element: <CustomizeOverlayPage />
  },
  {
    path: '/share'
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: '/about/safety',
    element: <AboutSafetyPage />
  }
]

// Create the router using createBrowserRouter.
const router = createBrowserRouter(routes)

const App = () => (<RouterProvider router={router} />)
export default App