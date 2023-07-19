<template>
  <div class="view col spaced" style="gap: 2em">
    <div class="row spaced">
      <IconButton v-if="page != 0" @click="prevPage"></IconButton>
      <h2>{{ $t().reportAnEvent }}</h2>
      <IconButton icon="xmark" @click="exitPage"></IconButton>
    </div>

    <div>
      <CategoryForm
        v-if="page == Page.Category"
        @category="observation.category = $event"
      ></CategoryForm>
      <LocationForm
        v-if="page == Page.Location"
        @location="observation.position = $event"
      ></LocationForm>
      <DescriptionForm
        v-if="page == Page.Description"
        @description="observation.message = $event"
      ></DescriptionForm>
      <PictureForm
        v-if="page == Page.Picture"
        :image-src="observation.image"
        @update-picture="observation.image = $event"
      ></PictureForm>
      <OverviewForm
        v-if="page == Page.Overview"
        :event="observation"
      ></OverviewForm>
    </div>
  </div>
  <div class="view-bottom col">
    <button v-if="page == Page.Overview" class="btn" @click="nextPage">
      {{ $t().publish }}
    </button>
    <button v-if="page != Page.Overview" class="btn" @click="nextPage">
      {{ $t().continue }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import CategoryForm from './CategoryForm.vue'
import LocationForm from './LocationForm.vue'
import DescriptionForm from './DescriptionForm.vue'
import PictureForm from './PictureForm.vue'
import IconButton from '@/components/IconButton.vue'
import OverviewForm from './OverviewForm.vue'
import { reactive, ref } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'
import { serverUrl } from '@/scripts/url'
import { Observation } from '@/scripts/alert'

enum Page {
  Category,
  Location,
  Description,
  Picture,
  Overview,
  End,
}

type RequestState = 'not-sent' | 'fail' | 'success'
const page = ref<Page>(0)
const requestState = ref<RequestState>('not-sent')

const observation = reactive<Observation>({
  message: '',
  position: { latitude: 0.0, longitude: 0.0 },
  category: 'flood',
  image: "",
})

const prevPage = () => {
  page.value = Math.max(0, page.value - 1)
}

const nextPage = () => {
  page.value = page.value + 1
  if (page.value >= Page.End) {
    postEvent()
    router.push({ name: 'network' })
  }
}

const exitPage = () => {
  router.back()
}

const postEvent = async () => {
  try {
    const response = await fetch(`${serverUrl}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(observation),
    })
    requestState.value = response.ok ? 'success' : 'fail'
  } catch {
    requestState.value = 'fail'
  }
}
</script>

<style scoped></style>
