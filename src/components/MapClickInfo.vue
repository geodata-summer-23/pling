<template>
  <div class="row center" style="gap: 1em">
    <img :src="getCategoryIconSrc(title as Category)" alt="" />
    <h3 style="text-align: center">{{ $t().dangerOf }} {{ $text(title) }}</h3>
  </div>
  <p>
    {{ description }}
  </p>
</template>

<script lang="ts" setup>
import { Category, getCategoryIconSrc } from '@/scripts/category'
import { $t, $text } from '@/translation'

defineProps<{
  title: string
  description: string
}>()
</script>
