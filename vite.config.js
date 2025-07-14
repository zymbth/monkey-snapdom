import { defineConfig } from 'vite';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: '网页元素截图',
        namespace: '',
        match: ['*'],
      },
      build: {
        externalGlobals: {
          '@zumer/snapdom': cdn.unpkg('snapdom', 'dist/snapdom.min.js'),
        },
        cssSideEffects: (css) => {
          const t = JSON.stringify(css)
          return `GM_addStyle(${t})`
        }
      }
    }),
  ],
});
