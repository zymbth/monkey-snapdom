import './style.css'
import { manualDelay, shining } from './utils.js'
// import { snapdom } from '@zumer/snapdom'

/**
 * 网页截图插件
 *
 * @description 基于 [snapdom](https://github.com/zumerlab/snapdom) 实现的网页截图功能，开始截图后，可移动鼠标选中网页元素，点击以下载
 * @author ymzhaobth@gmail.com
 * @license MIT
 */

let hoverEl = null
let isChosing = false
let loading = false
const TIMEOUT = 1000 * 60

window.onload = function() {
  const startEl = document.createElement('a')
  startEl.id = 'snap-dom'
  startEl.innerText = '截'
  startEl.addEventListener('click', async () => {
    if(isChosing || loading) return
    isChosing = true
    document.body.addEventListener('mousemove', handleMousemove)
    setTimeout(() => {
      document.body.addEventListener('click', handleConfirmTarget)
    }, 200)
  })
  document.body.append(startEl)
}

function handleMousemove(e) {
  if(!isChosing || !e.target) return
  if(hoverEl) hoverEl.classList.remove('snap-target')
  e.target.classList.add('snap-target')
  hoverEl = e.target
}
async function handleConfirmTarget(e) {
  isChosing = false
  document.body.removeEventListener('mousemove', handleMousemove)
  document.body.removeEventListener('click', handleConfirmTarget)

  if(!hoverEl) {
    shining('未选中目标', 'orange')
    return
  }
  hoverEl.classList.remove('snap-target')
  // 下载
  loading = true
  const startEl = document.getElementById('snap-dom')
  startEl.classList.add('loading')
  await manualDelay(50)
  try {
    await execSnapDom(hoverEl)
    shining('下载成功')
  } catch(err) {
    shining('下载失败', 'red')
    console.error(err)
  }
  loading = false
  startEl.classList.remove('loading')
  hoverEl = null
}

// 指定DOM元素，下载其内容
async function execSnapDom(targetEl) {
  if(!snapdom) {
    console.error('未加载插件snapdom')
    return
  }
  if(!targetEl) {
    console.error('未指定捕获元素')
    return
  }
  console.time('捕获耗时：')
  const capture = await snapdom(targetEl, {
    embedFonts: true,
    compress: true
  })
  console.timeEnd('捕获耗时：')
  console.time('下载耗时：')
  await capture.download({
    format: 'jpg',
    filename: 'chart-report-2025'
  });
  console.timeEnd('下载耗时：')
}