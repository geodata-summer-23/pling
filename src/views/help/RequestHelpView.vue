<template>
  <div class="view col spaced" style="gap: 2em">
    <div class="row spaced">
      <IconButton v-if="page != 0" @click="prevPage"></IconButton>
      <h2>{{ $t().requestHelp }}</h2>
      <IconButton icon="xmark" @click="exitPage"></IconButton>
    </div>

    <div>
      <CategoryForm
        v-if="page == Page.Category"
        @category="helpRequest.category = $event"
      ></CategoryForm>
      <LocationForm
        v-if="page == Page.Location"
        @location="helpRequest.position = $event"
      ></LocationForm>
      <DescriptionForm
        v-if="page == Page.Description"
        @description="helpRequest.message = $event"
      ></DescriptionForm>
      <OverviewForm
        v-if="page == Page.Overview"
        :help-request="helpRequest"
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
import CategoryForm from '@/views/event/CategoryForm.vue'
import LocationForm from '@/views/event/LocationForm.vue'
import DescriptionForm from '@/views/event/DescriptionForm.vue'
import IconButton from '@/components/IconButton.vue'
import OverviewForm from './OverviewForm.vue'
import { reactive, ref } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'
import { useHelpRequestStore, HelpRequest } from '@/stores/helpRequestStore'

enum Page {
  Location,
  Category,
  Description,
  Overview,
  End,
}

const page = ref<Page>(0)

const helpRequest = reactive<HelpRequest>({
  message: '',
  position: { latitude: 0.0, longitude: 0.0 },
  timestamp: -1,
  category: 'flood',
  dist: -1,
})
const helpRequestStore = useHelpRequestStore()

const prevPage = () => {
  page.value = Math.max(0, page.value - 1)
}

const nextPage = () => {
  page.value = page.value + 1
  if (page.value >= Page.End) {
    helpRequestStore.requestHelp(helpRequest)
    router.push({ name: 'network' })
  }
}

const exitPage = () => {
  router.back()
}
</script>

<style scoped></style>
