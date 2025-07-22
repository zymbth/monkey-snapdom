import { defineConfig } from 'vite'
import { resolve } from 'path'

const root = process.cwd()

function pathResolve(dir) {
  return resolve(root, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  root: pathResolve('docs'),
})
