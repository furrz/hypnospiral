import * as React from 'react'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Spiral from 'components/spiral'

export default function SpiralPage () {
  const navigate = useNavigate()

  const keyHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === ' ') navigate('/')
  }, [navigate])

  const clickHandler = useCallback((event: MouseEvent) => {
    if (event.clientY > window.innerHeight / 5 * 3 && event.clientX > window.innerWidth / 5 * 3) {
      navigate(-1)
    } else {
      const fsElement = document.fullscreenElement ?? document.webkitFullscreenElement

      const fsRequest = document.documentElement.requestFullscreen ??
        document.documentElement.webkitRequestFullscreen ??
        document.documentElement.mozRequestFullscreen ?? ((_: any) => {})

      const fsExitRequest = document.exitFullscreen ?? document.webkitExitFullscreen ?? (() => {})

      if (fsElement !== null && fsElement !== undefined) {
        fsExitRequest.call(document)
      } else {
        fsRequest.call(document.documentElement, { navigationUI: 'hide' })
      }
    }
  }, [navigate])

  useEffect(() => {
    document.addEventListener('keydown', keyHandler)
    document.addEventListener('mousedown', clickHandler)
    return () => {
      document.removeEventListener('keydown', keyHandler)
      document.removeEventListener('mousedown', clickHandler)
    }
  }, [keyHandler, clickHandler])

  localStorage.setItem('has-seen-safety', 'true')
  return <div className="full_page_spiral"><Spiral/></div>
};
