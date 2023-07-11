<template>
  <div class="view col spaced" style="gap: 2em">
    <div class="row spaced">
      <BackButton v-if="page != 0" @click="prevPage"></BackButton>
      <h2>{{ $t().reportAnEvent }}</h2>
      <BackButton icon="xmark" @click="exitPage"></BackButton>
    </div>

    <div>
      <CategoryView
        v-if="page == Page.Category"
        @category="alertData.category = $event"
      ></CategoryView>
      <LocationView
        v-if="page == Page.Location"
        @location="alertData.position = $event"
      ></LocationView>
      <DescriptionView
        v-if="page == Page.Description"
        @description="alertData.message = $event"
      ></DescriptionView>
      <PictureView v-if="page == Page.Picture"></PictureView>
      <OverviewView
        v-if="page == Page.Overview"
        :event="alertData"
      ></OverviewView>
    </div>
  </div>
  <!-- <p>{{ data }}</p> -->
  <div class="view-bottom col">
    <button v-if="page == 4" class="btn" @click="nextPage">
      {{ $t().publish }}
    </button>
    <button v-if="page != 4" class="btn" @click="nextPage">
      {{ $t().continue }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import CategoryView from './CategoryView.vue'
import LocationView from './LocationView.vue'
import DescriptionView from './DescriptionView.vue'
import PictureView from './PictureView.vue'
import BackButton from '@/components/BackButton.vue'
import { reactive, ref } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'
import OverviewView from './OverviewView.vue'
import { AddressPoint } from '@/stores/placeStore'

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

const alertData = reactive<AlertData>({
  message: '',
  position: { latitude: 0.0, longitude: 0.0 },
  timestamp: -1,
  category: 'flood',
  dist: -1,
})

export type CategoryState =
  | 'flood'
  | 'torrentialRain'
  | 'fire'
  | 'wind'
  | 'avalanche'
  | 'other'

export type AlertData = {
  message: string
  position: AddressPoint
  timestamp: number
  category: CategoryState
  dist: number
}

const prevPage = () => {
  page.value = Math.max(0, page.value - 1)
}

const nextPage = () => {
  page.value = page.value + 1
  if (page.value >= Page.End) {
    postAlert()
    router.push({ name: 'message' })
  }
}

const exitPage = () => {
  router.back()
}

const postAlert = async () => {
  alertData.timestamp = Date.now()
  try {
    const response = await fetch(`http://localhost:8000/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData),
    })
    requestState.value = response.ok ? 'success' : 'fail'
  } catch {
    requestState.value = 'fail'
    console.log(alertData)
  }
}
</script>

<style scoped></style>
