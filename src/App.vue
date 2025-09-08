<script setup>
import { getCurrentInstance, ref } from 'vue'
import SnapdomUtil from './utils/SnapdomUtil'

const isChosing = ref(false)
const loading = ref(false)

const snapdomUtil = new SnapdomUtil(isChosing, loading)
console.log('snapdomUtil: ', snapdomUtil)

// 暴露给全局
const instance = getCurrentInstance()
instance.appContext.config.globalProperties.$startChosing = () => snapdomUtil.startChosing()
instance.appContext.config.globalProperties.$stopChosing = () => snapdomUtil.stopChosing()


function onCustomSnap() {
  snapdomUtil.stopChosing()
}
</script>

<template>
  <div id="snap-app" :class="{ hide: isChosing, loading }" @click="onCustomSnap">截</div>
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
.hide {
  display: none;
}
.loading {
  opacity: 0.5;
  cursor: progress;
}
</style>