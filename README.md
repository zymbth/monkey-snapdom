# 网页DOM捕获截图

## 介绍

使用SnapDOM实现的网页DOM捕获截图插件，仓库[地址](https://github.com/zymbth/monkey-snapdom)。

> [@zumer/snapdom](https://github.com/zumerlab/snapdom): SnapDOM captures HTML elements to images with exceptional speed and accuracy, supporting pseudo-elements, shadow DOM, web fonts, and more.

## 功能

为了避免污染页面，取消了在页面中插入固定菜单的设计。

点击油猴脚本，再点击本插件菜单即可开始在网页上选择DOM元素，再次点击即可下载其内容，按Esc键取消选择。

网页中鼠标右键也可以在油猴脚本的二级菜单中找到本插件。

## 问题

- 速度

不同于普通截图，`@zumer/snapdom` 需要解析网页上的DOM元素，耗时更长，期待后续改进。

- 背景色

默认没有设置背景色，当背景色设置在所选取元素的上级元素上时，会出现背景色不对的情况。比较典型的就是深色模式下，下载后会出现白色/透明背景的情况。考虑在本插件后续版本中新增选择配置及预览功能。

- BUG：
  - 亲测(`v1.9.7`)，偶尔会出现一直在解析或解析失败的情况
  - 直接选择图片时，可能会因跨域问题导致下载失败

## TODO List

- [x] 快捷键启动
- [ ] 可选择配置
- [ ] 可预览

## 反馈

欢迎[反馈](https://github.com/zymbth/monkey-snapdom/issues)，或者提交PR。
