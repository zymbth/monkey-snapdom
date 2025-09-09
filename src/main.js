import './styles/index.css'
import SnapdomUtil from './utils/SnapdomUtil.js'

/**
 * 网页截图插件
 *
 * @description 基于 [snapdom](https://github.com/zumerlab/snapdom) 实现的网页截图功能，开始截图后，可移动鼠标选中网页元素，点击以下载
 * @author ymzhaobth@gmail.com
 * @license MIT
 */

// @ts-ignore
// const TIMEOUT = 1000 * 60

const snapdomUtil = new SnapdomUtil()

try {
  // 菜单
  // @ts-ignore
  const menu_command_id_1 = GM_registerMenuCommand(
    '选中并截图',
    snapdomUtil.startChosing.bind(snapdomUtil),
    {
      accessKey: 's',
      autoClose: true,
      title: '点击后，可选中网页元素以截图'
    }
  )
} catch (error) {}

// 监听全局快捷键: Ctrl+Shift+,
window.onload = function () {
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === ',' || e.key === '<')) {
      e.preventDefault()
      if (snapdomUtil.isChosing) snapdomUtil.stopChosing()
      else snapdomUtil.startChosing()
    }
  })
}
