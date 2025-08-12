// ==UserScript==
// @name         网页DOM捕获截图
// @namespace
// @version      0.0.11
// @author       ymzhao
// @description  使用SnapDOM实现的网页DOM捕获截图插件
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4LnNlYXJjaF9pbmRleC4wLmk3Ljc2NDAzYTgxRTZSV0ZmIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk3NS4wNTMgNTM1LjkwN2EyMS4zMzMgMjEuMzMzIDAgMCAxLTE1LjI0NiAxNy45MmwtMjA2IDU5LjY0IDEzMC4zODYgMjI1LjgyNmE1My4zMzMgNTMuMzMzIDAgMCAxLTE5LjUyNiA3Mi44Nkw3MzUuMzMzIDk4Ni44MmE1My4zMzMgNTMuMzMzIDAgMCAxLTcyLjg1My0xOS41MjdMNTMyLjEgNzQxLjQ2NyAzNzcuNDMzIDg5MC4wNTNhMjEuMzMzIDIxLjMzMyAwIDAgMS0zNi4xLTE1LjM4NlYxOTJBMjEuMzMzIDIxLjMzMyAwIDAgMSAzNTIgMTczLjUyN2MzLjIwNy0xLjg1NCAxMS43NDctNS41MzQgMjEuNzYuMjQ2bDkxLjk0NyA1My4wODcgNDk4LjgzMyAyODhhMjEuMzMzIDIxLjMzMyAwIDAgMSAxMC41MTMgMjEuMDQ3ek0yOTguNjY3IDY2MS4zMzNBMjEuMzMzIDIxLjMzMyAwIDAgMCAyNzcuMzMzIDY0MEg5NmExMC42NjcgMTAuNjY3IDAgMCAxLTEwLjY2Ny0xMC42NjdWOTZBMTAuNjY3IDEwLjY2NyAwIDAgMSA5NiA4NS4zMzNoNzQ2LjY2N0ExMC42NjcgMTAuNjY3IDAgMCAxIDg1My4zMzMgOTZ2MjY2LjY2N2EyMS4zMzMgMjEuMzMzIDAgMCAwIDQyLjY2NyAwVjk2YTUzLjM5MyA1My4zOTMgMCAwIDAtNTMuMzMzLTUzLjMzM0g5NkE1My4zOTMgNTMuMzkzIDAgMCAwIDQyLjY2NyA5NnY1MzMuMzMzQTUzLjM5MyA1My4zOTMgMCAwIDAgOTYgNjgyLjY2N2gxODEuMzMzYTIxLjMzMyAyMS4zMzMgMCAwIDAgMjEuMzM0LTIxLjMzNHoiIGZpbGw9IiMxMjk2ZGIiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guc2VhcmNoX2luZGV4LjAuaTYuNzY0MDNhODFFNlJXRmYiIGNsYXNzPSJzZWxlY3RlZCIvPjwvc3ZnPg==
// @include      *
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
  try {
    const menu_command_id_1 = GM_registerMenuCommand(
      "选中并截图",
      startChosing,
      {
        accessKey: "s",
        autoClose: true,
        title: "点击后，可选中网页元素以截图"
      }
    );
  } catch (error) {
  }
  window.onload = function() {
    document.addEventListener("keydown", function(e) {
      if (e.ctrlKey && e.shiftKey && (e.key === "," || e.key === "<")) {
        e.preventDefault();
        if (isChosing) stopChosing();
        else startChosing();
      }
    });
  };
  function startChosing() {
    if (isChosing || loading) {
      console.warn("正在选中，已重新开始");
      stopChosing();
    }
    isChosing = true;
    document.body.addEventListener("mousemove", handleMousemove);
    setTimeout(() => {
      document.body.addEventListener("click", handleConfirmTarget);
      document.body.addEventListener("keydown", handleEsc);
    }, 200);
  }
  function stopChosing() {
    isChosing = false;
    document.body.removeEventListener("mousemove", handleMousemove);
    document.body.removeEventListener("click", handleConfirmTarget);
    document.body.removeEventListener("keydown", handleEsc);
    if (hoverEl) {
      hoverEl.classList.remove("snap-target");
      hoverEl = null;
    }
  }
  function handleMousemove(e) {
    if (!isChosing || !e.target) return;
    if (hoverEl) hoverEl.classList.remove("snap-target");
    e.target.classList.add("snap-target");
    hoverEl = e.target;
  }
  async function handleConfirmTarget(e) {
    if (!hoverEl) {
      shining("未选中目标", "orange");
      return;
    }
    const tmpEl = hoverEl;
    stopChosing();
    loading = true;
    await manualDelay(50);
    try {
      await execSnapDom(tmpEl);
      shining("下载成功");
    } catch (err) {
      shining("下载失败", "red");
      console.error(err);
    }
    loading = false;
  }
  function handleEsc(e) {
    if (e.keyCode !== 27) return;
    stopChosing();
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