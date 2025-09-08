import { createApp } from 'vue'
import './styles/index.css'
// import { snapdom } from '@zumer/snapdom'
import App from './App.vue'

/**
 * 网页截图插件
 *
 * @description 基于 [snapdom](https://github.com/zumerlab/snapdom) 实现的网页截图功能，开始截图后，可移动鼠标选中网页元素，点击以下载
 * @author ymzhaobth@gmail.com
 * @license MIT
 */

// @ts-ignore
const TIMEOUT = 1000 * 60

let initialed = false
let app = null

function initApp() {
  if(initialed) return
  initialed = true
  app = createApp(App)
  app.mount(
    (() => {
      const app = document.createElement('div')
      document.body.append(app)
      return app
    })()
  )
}

try {
  // 菜单
  // @ts-ignore
  const menu_command_id_1 = GM_registerMenuCommand(
    '选中并截图',
    startChosing1,
    {
      accessKey: 's',
      autoClose: true,
      title: '点击后，可选中网页元素以截图'
    }
  )
} catch {}

// 监听全局快捷键: Ctrl+Shift+,
window.onload = function () {
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === ',' || e.key === '<')) {
      e.preventDefault()
      startChosing1()
    }
  })
}

function startChosing1() {
  initApp()
  if(app && app.config.globalProperties.$startChosing) app.config.globalProperties.$startChosing()
}
function stopChosing1() {
  if(app && app.config.globalProperties.$stopChosing) app.config.globalProperties.$stopChosing()
}
