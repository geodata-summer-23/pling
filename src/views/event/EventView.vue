<template>
    <div class="view col spaced" style="gap: 2em">
      <div class="row">
        <BackButton v-if="page != 0" @click="prevPage"></BackButton>
        <h2>{{ $t().reportAnEvent }}</h2>
      </div>

      <div>
        <CategoryView v-if="page == Page.Category"></CategoryView>
        <LocationView v-if="page == Page.Location"></LocationView>
        <DescriptionView v-if="page == Page.Description"></DescriptionView>
        <PictureView v-if="page == Page.Picture"></PictureView>
      </div>
    </div>
    <div class="view-bottom col">
      <button v-if="page != 0" class="btn" @click="nextPage">Skip</button>
      <button class="btn" @click="nextPage">Continue</button>
    </div>
  </template>

<script lang="ts" setup>
import CategoryView from './CategoryView.vue'
import LocationView from './LocationView.vue'
import DescriptionView from './DescriptionView.vue'
import PictureView from './PictureView.vue'
import BackButton from '@/components/BackButton.vue'
import { ref } from 'vue'
import { router } from '@/router'
import { useUserStore } from '@/stores/userStore'
import { $t } from '@/translation'

enum Page {
  Category,
  Location,
  Description,
  Picture,
  End,
}

const page = ref<Page>(0)

const prevPage = () => {
  page.value = Math.max(0, page.value - 1)
}

const nextPage = () => {
  page.value = page.value + 1
  if (page.value >= Page.End) {
    useUserStore().setGuid()
    router.push({ name: 'message' })
  }
}
</script>

<style scoped></style>