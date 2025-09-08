import { manualDelay, shining } from '../utils.js'

export default class SnapdomUtil {
  // 构造函数
  constructor(isChosing, loading, confirmCallback) {
    this._getSnapDom()
    this._isChosing = isChosing
    this._loading = loading
    this._hoverEl = null
    this._cb = confirmCallback
  }
  
  async _getSnapDom() {
    let tmp = window?.snapdom
    if(!tmp && process.env.NODE_ENV === 'development') {
      try {
        tmp = await import('@zumer/snapdom').then(module => module.snapdom)
      } catch {}
    }
    this._snapdom = tmp
  }

  // 开启功能
  startChosing() {
    if(this._isChosing.value || this._loading.value) {
      console.warn('正在选中，已重新开始')
      this.stopChosing()
    }
    this._isChosing.value = true
    document.body.addEventListener('mousemove', this._handleMousemove)
    setTimeout(() => {
      document.body.addEventListener('click', this._handleConfirmTarget)
      document.body.addEventListener('keydown', this._handleEsc)
    }, 200)
  }

  // 关闭功能
  stopChosing() {
    this._isChosing.value = false
    document.body.removeEventListener('mousemove', this._handleMousemove)
    document.body.removeEventListener('click', this._handleConfirmTarget)
    document.body.removeEventListener('keydown', this._handleEsc)
    if(this._hoverEl) {
      this._hoverEl.classList.remove('snap-target')
      this._hoverEl = null
    }
  }

  destroy() {
    this._loading = null
    this._isChosing = null
    this.startChosing = () => {}
    this.stopChosing()
  }

  // 鼠标移动
  _handleMousemove = (e) => {
    if(!this._isChosing.value || !e.target) return
    if(this._hoverEl) this._hoverEl.classList.remove('snap-target')
    e.target.classList.add('snap-target')
    this._hoverEl = e.target
  }

  // 点击确认选中
  // @ts-ignore
  _handleConfirmTarget = async (e) => {
    if(!this._hoverEl) {
      shining('未选中目标', 'orange')
      return
    }
    const tmpEl = this._hoverEl
    this.stopChosing()
    // 下载
    this._loading.value = true
    await manualDelay(50)
    try {
      await this._execSnapDom(tmpEl)
      shining('下载成功')
    } catch(err) {
      shining('下载失败', 'red')
      console.error(err)
    }
    this._loading.value = false
  }

  // ESC取消选中
  _handleEsc = (e) => {
    if(e.keyCode !== 27) return
    this.stopChosing()
  }

  // 指定DOM元素，下载其内容
  async _execSnapDom (targetEl) {
    // @ts-ignore
    if(!this._snapdom) {
      console.error('未加载插件snapdom')
      return
    }
    if(!targetEl) {
      console.error('未指定捕获元素')
      return
    }
    console.time('捕获耗时：')
    // @ts-ignore
    const capture = await this._snapdom(targetEl, {
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
}