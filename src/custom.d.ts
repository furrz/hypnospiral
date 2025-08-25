interface Document {
  mozCancelFullScreen?: any
  webkitExitFullscreen?: any
  fullscreenElement?: any
  mozFullScreenElement?: any
  webkitFullscreenElement?: any
}

interface HTMLElement {
  webkitRequestFullscreen?: any
  mozRequestFullscreen?: any
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare module '*.glsl' {
  const content: string
  export default content
}

declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}

declare module '*.txt' {
  const content: string
  export default content
}
