<template>
  <div class="col" style="gap: 1em">
    <input
      type="file"
      id="imageInput"
      style="visibility: hidden"
      accept="image/*"
      capture="environment"
      @change="takePicture(($event.target as HTMLInputElement).files)"
    />
    <div class="row center">
      <label class="btn" style="" for="imageInput">{{
        $t().takePicture
      }}</label>
    </div>
    <img ref="imgRef" />
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
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

<style scoped>
img {
  width: 100%;
}
</style>
