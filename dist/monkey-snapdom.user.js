// ==UserScript==
// @name         网页DOM捕获截图
// @namespace
// @version      0.0.1
// @author       ymzhao
// @description  使用SnapDOM实现的网页DOM捕获截图插件
// @license      MIT
// @match        *
// @require      https://unpkg.com/@zumer/snapdom@latest/dist/snapdom.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

GM_addStyle(" .snap-target{box-shadow:inset 0 0 4px 2px green,0 0 10px 4px green!important} ");

(function () {
  'use strict';

  function manualDelay(delay = 500) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  function shining(message, color = "rgb(50, 177, 108)", fontSize = "xxx-large") {
    if (!message) return;
    const i = document.createElement("span");
    i.textContent = message;
    i.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    color: ${color};
    font-size: ${fontSize};
    font-weight: bold;
    transform: translate(-50%, -50%);
    user-select: none;
    z-index: 2002;`;
    document.body.appendChild(i);
    const duration = 2500;
    i.animate(
      [{ top: "50%", opacity: 1 }, { top: "30%", opacity: 0 }],
      { duration, fill: "forwards" }
    );
    setTimeout(i.remove, duration);
  }
  /**
   * 网页截图插件
   *
   * @description 基于 [snapdom](https://github.com/zumerlab/snapdom) 实现的网页截图功能，开始截图后，可移动鼠标选中网页元素，点击以下载
   * @author ymzhaobth@gmail.com
   * @license MIT
   */
  let hoverEl = null;
  let isChosing = false;
  let loading = false;
  GM_registerMenuCommand("选中并截图", function(e) {
    if (isChosing || loading) return;
    isChosing = true;
    document.body.addEventListener("mousemove", handleMousemove);
    setTimeout(() => {
      document.body.addEventListener("click", handleConfirmTarget);
    }, 200);
  }, {
    accessKey: "s",
    autoClose: true,
    title: "点击后，可选中网页元素以截图"
  });
  function handleMousemove(e) {
    if (!isChosing || !e.target) return;
    if (hoverEl) hoverEl.classList.remove("snap-target");
    e.target.classList.add("snap-target");
    hoverEl = e.target;
  }
  async function handleConfirmTarget(e) {
    isChosing = false;
    document.body.removeEventListener("mousemove", handleMousemove);
    document.body.removeEventListener("click", handleConfirmTarget);
    if (!hoverEl) {
      shining("未选中目标", "orange");
      return;
    }
    hoverEl.classList.remove("snap-target");
    loading = true;
    await manualDelay(50);
    try {
      await execSnapDom(hoverEl);
      shining("下载成功");
    } catch (err) {
      shining("下载失败", "red");
      console.error(err);
    }
    loading = false;
    hoverEl = null;
  }
  async function execSnapDom(targetEl) {
    if (!snapdom) {
      console.error("未加载插件snapdom");
      return;
    }
    if (!targetEl) {
      console.error("未指定捕获元素");
      return;
    }
    console.time("捕获耗时：");
    const capture = await snapdom(targetEl, {
      embedFonts: true,
      compress: true
    });
    console.timeEnd("捕获耗时：");
    console.time("下载耗时：");
    await capture.download({
      format: "jpg",
      filename: "chart-report-2025"
    });
    console.timeEnd("下载耗时：");
  }

})();