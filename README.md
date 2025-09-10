# 网页DOM捕获截图

## 介绍

使用SnapDOM实现的网页DOM捕获截图脚本，仓库[地址](https://github.com/zymbth/monkey-snapdom)。

> [@zumer/snapdom](https://github.com/zumerlab/snapdom): SnapDOM captures HTML elements to images with exceptional speed and accuracy, supporting pseudo-elements, shadow DOM, web fonts, and more.

本脚本功能只有一个，点击**菜单/快捷键**开启选择页面元素功能，再次点击即可将该元素内容下载为图片。

为了避免污染页面，本脚本不会在页面中插入任何元素。事件监听仅在开启时添加，完成/关闭后移除。

## 使用说明

### 开启功能

开启后可在网页上选择DOM元素，再次点击即可下载其内容

- 点击油猴脚本，再点击本**脚本菜单**
- 网页中**鼠标右键**也可以在油猴脚本的二级菜单中找到本脚本
- 快捷键开启：**Ctrl+Shift+,**

### 关闭功能

取消进行中的选取并关闭功能

- 按**Esc**键
- 快捷键关闭：**Ctrl+Shift+,**

### 演示

![演示](https://github.com/zymbth/monkey-snapdom/raw/master/demo-snapdom.gif)

## 问题

- 耗时

不同于普通截图，`@zumer/snapdom` 需要解析网页上的DOM元素及样式，内容越复杂耗时越长。

- 背景色

默认背景色为白色(`#fff`)，当实际背景色源于目标元素的上级元素时，下载后背景色会缺失。

例如：网页body上设置了黑色背景色，选择段落元素下载后，发现背景色变成白色。

本脚本中补充了一个递归获取目标元素“实际”背景色的功能。

- 元素样式缓存

`@zumer/snapdom` 插件内部**缓存**了已捕获元素的样式。后续截取包含已缓存元素时，可能会导致样式不对(如：主题更换、明暗模式更换等原因导致的样式更新)。

- 图片

直接选择图片时，可能会因跨域问题导致下载失败

- 事件监听拦截

本脚本的事件监听绑定在`document.body`上，某些网页内容拦截了事件监听、阻止了事件冒泡，导致无法下载

- 解析异常BUG

亲测(`v1.9.7`)，偶尔会出现一直在解析或解析失败的情况，未提供中断解析的方法

## TODO List

- [x] 快捷键启动
- [x] 修复背景色丢失bug
- [ ] 超时中断解析

## 反馈

欢迎[反馈](https://github.com/zymbth/monkey-snapdom/issues)，或者提交PR。
