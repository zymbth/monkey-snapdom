import './styles/index.css'
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
// @ts-ignore
const TIMEOUT = 1000 * 60

// 菜单
// @ts-ignore
// @ts-ignore
const menu_command_id_1 = GM_registerMenuCommand('选中并截图', function (e) {
  if (isChosing || loading) return
  isChosing = true
  document.body.addEventListener('mousemove', handleMousemove)
  setTimeout(() => {
    document.body.addEventListener('click', handleConfirmTarget)
    document.body.addEventListener('keydown', handleKeydown)
  }, 200)
}, {
  accessKey: 's',
  autoClose: true,
  title: '点击后，可选中网页元素以截图'
});

// 鼠标移动
function handleMousemove(e) {
  if(!isChosing || !e.target) return
  if(hoverEl) hoverEl.classList.remove('snap-target')
  e.target.classList.add('snap-target')
  hoverEl = e.target
}
// 点击确认选中
// @ts-ignore
async function handleConfirmTarget(e) {
  isChosing = false
  document.body.removeEventListener('mousemove', handleMousemove)
  document.body.removeEventListener('click', handleConfirmTarget)
  document.body.removeEventListener('keydown', handleKeydown)

  if(!hoverEl) {
    shining('未选中目标', 'orange')
    return
  }
  hoverEl.classList.remove('snap-target')
  // 下载
  loading = true
  await manualDelay(50)
  try {
    await execSnapDom(hoverEl)
    shining('下载成功')
  } catch(err) {
    shining('下载失败', 'red')
    console.error(err)
  }
  loading = false
  hoverEl = null
}
// ESC取消选中
function handleKeydown(e) {
  if(e.keyCode !== 27) return
  isChosing = false
  document.body.removeEventListener('mousemove', handleMousemove)
  document.body.removeEventListener('click', handleConfirmTarget)
  document.body.removeEventListener('keydown', handleKeydown)
  if(hoverEl) {
    hoverEl.classList.remove('snap-target')
    hoverEl = null
  }
}

// 指定DOM元素，下载其内容
async function execSnapDom(targetEl) {
  // @ts-ignore
  if(!snapdom) {
    console.error('未加载插件snapdom')
    return
  }
  if(!targetEl) {
    console.error('未指定捕获元素')
    return
  }
  console.time('捕获耗时：')
  // @ts-ignore
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
