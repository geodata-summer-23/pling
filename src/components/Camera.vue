<template>
  <div class="col" style="gap: 1em">
    <input
      type="file"
      id="imageInput"
      style="visibility: hidden"
      accept="image/*"
      capture="environment"
      @change="
        takePictureAndCompress(($event.target as HTMLInputElement).files)
      "
    />
    <div class="row center" style="gap: 1em">
      <label v-if="hasImage" class="btn" @click="clearPicture">
        {{ $t().delete }}</label
      >
      <label class="btn" for="imageInput">{{ $t().takePicture }}</label>
    </div>
    <img ref="imgRef" />
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  imageSrc?: string
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const hasImage = ref(props.imageSrc && props.imageSrc.length > 0)

onMounted(() => {
  if (imgRef.value) {
    imgRef.value.src = props.imageSrc ?? ''
  }
})

const emit = defineEmits<{
  (e: 'update-picture', src: string): void
}>()

const clearPicture = () => {
  emit('update-picture', '')
  hasImage.value = false
  if (!imgRef.value) return
  imgRef.value.src = ''
}

const takePictureAndCompress = (fileList: FileList | null) => {
  if (!fileList) return
  const imgFile = fileList[0]
  const reader = new FileReader()
  reader.readAsDataURL(imgFile)
  reader.onload = () => {
    if (!imgRef.value || !reader.result) return
    const img = new Image()
    img.src = reader.result.toString()
    ;(img.onload = () => {
      const width = 300
      const height = 300
      if (!imgRef.value) return
      const elem = document.createElement('canvas')
      elem.width = width
      elem.height = height
      const ctx = elem.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, width, height)
      const src = ctx.canvas.toDataURL()
      imgRef.value.src = src
      hasImage.value = true
      emit('update-picture', src)
    }),
      (reader.onerror = (error) => console.error(error))
  }
}
</script>

<style scoped>
img {
  width: 100%;
}
</style>
