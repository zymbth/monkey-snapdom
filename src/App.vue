<script setup>
import { getCurrentInstance } from 'vue'
import { manualDelay, shining } from './utils.js'

let hoverEl = null
let isChosing = false
let loading = false

// 开启功能
function startChosing() {
  if(isChosing || loading) {
    console.warn('正在选中，已重新开始')
    stopChosing()
  }
  isChosing = true
  document.body.addEventListener('mousemove', handleMousemove)
  setTimeout(() => {
    document.body.addEventListener('click', handleConfirmTarget)
    document.body.addEventListener('keydown', handleEsc)
  }, 200)
}

// 关闭功能
function stopChosing() {
  isChosing = false
  document.body.removeEventListener('mousemove', handleMousemove)
  document.body.removeEventListener('click', handleConfirmTarget)
  document.body.removeEventListener('keydown', handleEsc)
  if(hoverEl) {
    hoverEl.classList.remove('snap-target')
    hoverEl = null
  }
}

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
  if(!hoverEl) {
    shining('未选中目标', 'orange')
    return
  }
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
  stopChosing()
}

// ESC取消选中
function handleEsc(e) {
  if(e.keyCode !== 27) return
  stopChosing()
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

// 暴露给全局
const instance = getCurrentInstance()
instance.appContext.config.globalProperties.$startChosing = startChosing
instance.appContext.config.globalProperties.$stopChosing = stopChosing

</script>

<template>
  <div id="snap-app">TEST</div>
</template>

<style scoped>
#snap-app {
  /* display: none; */
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
}
</style>