<template>
  <h3>{{ $t().pictureEvent }}</h3>
  <p>{{ $t().addPictureDescription }}</p>
  <Camera></Camera>
</template>

<script lang="ts" setup>
import Camera from '@/components/Camera.vue'
import { $t } from '@/translation'
</script>
