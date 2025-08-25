import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    exclude: [],
    root: 'src',
    environment: 'happy-dom'
  },
  plugins: [tsconfigPaths()]
})
