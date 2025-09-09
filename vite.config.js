import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [util.unimportPreset],
    }),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: '网页DOM捕获截图',
        namespace: '',
        match: ['*'],
        include: ['*'],
        require: ['https://unpkg.com/@zumer/snapdom@latest/dist/snapdom.min.js'],
        icon: 'data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmk3Ljc2NDAzYTgxRTZSV0ZmIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk3NS4wNTMgNTM1LjkwN2EyMS4zMzMgMjEuMzMzIDAgMCAxLTE1LjI0NiAxNy45MmwtMjA2IDU5LjY0IDEzMC4zODYgMjI1LjgyNmE1My4zMzMgNTMuMzMzIDAgMCAxLTE5LjUyNiA3Mi44Nkw3MzUuMzMzIDk4Ni44MmE1My4zMzMgNTMuMzMzIDAgMCAxLTcyLjg1My0xOS41MjdMNTMyLjEgNzQxLjQ2NyAzNzcuNDMzIDg5MC4wNTNhMjEuMzMzIDIxLjMzMyAwIDAgMS0zNi4xLTE1LjM4NlYxOTJBMjEuMzMzIDIxLjMzMyAwIDAgMSAzNTIgMTczLjUyN2MzLjIwNy0xLjg1NCAxMS43NDctNS41MzQgMjEuNzYuMjQ2bDkxLjk0NyA1My4wODcgNDk4LjgzMyAyODhhMjEuMzMzIDIxLjMzMyAwIDAgMSAxMC41MTMgMjEuMDQ3ek0yOTguNjY3IDY2MS4zMzNBMjEuMzMzIDIxLjMzMyAwIDAgMCAyNzcuMzMzIDY0MEg5NmExMC42NjcgMTAuNjY3IDAgMCAxLTEwLjY2Ny0xMC42NjdWOTZBMTAuNjY3IDEwLjY2NyAwIDAgMSA5NiA4NS4zMzNoNzQ2LjY2N0ExMC42NjcgMTAuNjY3IDAgMCAxIDg1My4zMzMgOTZ2MjY2LjY2N2EyMS4zMzMgMjEuMzMzIDAgMCAwIDQyLjY2NyAwVjk2YTUzLjM5MyA1My4zOTMgMCAwIDAtNTMuMzMzLTUzLjMzM0g5NkE1My4zOTMgNTMuMzkzIDAgMCAwIDQyLjY2NyA5NnY1MzMuMzMzQTUzLjM5MyA1My4zOTMgMCAwIDAgOTYgNjgyLjY2N2gxODEuMzMzYTIxLjMzMyAyMS4zMzMgMCAwIDAgMjEuMzM0LTIxLjMzNHoiIGZpbGw9IiMxMjk2ZGIiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTYuNzY0MDNhODFFNlJXRmYiIGNsYXNzPSJzZWxlY3RlZCIvPjwvc3ZnPg=='
      },
      build: {
        externalGlobals: {
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js'),
        },
        cssSideEffects: (css) => {
          const t = JSON.stringify(css)
          return `GM_addStyle(${t});`
        }
      }
    }),
  ],
});
