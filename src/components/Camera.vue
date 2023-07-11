<template>
  <input
    type="file"
    accept="image/*"
    capture="environment"
    @change="takePicture(($event.target as HTMLInputElement).files)"
  />
  <img ref="imgRef" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const imgRef = ref<HTMLImageElement | null>(null)

const takePicture = (fileList: FileList | null) => {
  if (!fileList) return
  const imgFile = fileList[0]

  const reader = new FileReader()
  reader.onloadend = () => {
    if (!imgRef.value || !reader.result) return
    imgRef.value.src = reader.result?.toString()
  }
  reader.readAsDataURL(imgFile)
}
</script>

<style>
img {
  width: 100%;
}
</style>
