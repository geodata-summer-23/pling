<template>
  <h3>{{ $t().pictureEvent }}</h3>
  <p>{{ $t().addPictureDescription }}</p>
  <Camera
    :imageSrc="imageSrc"
    @update-picture="emit('update-picture', $event)"
  ></Camera>
</template>

<script lang="ts" setup>
import Camera from '@/components/Camera.vue'
import { $t } from '@/translation'

defineProps<{
  imageSrc?: string
}>()

const emit = defineEmits<{
  (e: 'update-picture', src: string): void
}>()
</script>
