import * as React from 'react'
import { createState } from 'state-pool'
import Spiral from 'components/spiral'

const previewState = createState(false)

export default function Previewer () {
  const [doPreview, setDoPreview] = previewState.useState()

  return <div
        className="preview_box hide_when_big_primary"
        onClick={() => { setDoPreview(!doPreview) }}>
        {doPreview ? <Spiral/> : <div className="preview_inactive_text">tap to toggle preview</div>}
    </div>
}
