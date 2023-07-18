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

const takePicture = (fileList: FileList | null) => {
  if (!fileList) return
  const imgFile = fileList[0]

  const reader = new FileReader()
  reader.onloadend = () => {
    if (!imgRef.value || !reader.result) return
    const src = reader.result.toString()
    emit('update-picture', src)
    hasImage.value = true
    imgRef.value.src = src
  }
  reader.readAsDataURL(imgFile)
}
</script>

<style scoped>
img {
  width: 100%;
}
</style>
