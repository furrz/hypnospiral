import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'components/app'
import './console_utils'

// fall back to document.body, basically exclusively to satisfy ESLint
const appElem = document.querySelector('#app') ?? document.body

if (navigator.userAgent.includes('AppleWebKit')) {
  appElem?.classList.add('is_webkit')
}

const root = createRoot(appElem)
root.render(<App/>)
