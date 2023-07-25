<template>
  <div class="lds-facebook" :style="{ scale }">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ scale?: number }>(), { scale: 1 })
</script>

<style scoped>
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 50px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: #fff;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  background-color: var(--c-dark-gray);
}
.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 0px;
    height: 64px;
  }
  50%,
  100% {
    top: 16px;
    height: 32px;
  }
}
</style>
