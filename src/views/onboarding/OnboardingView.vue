<template>
  <div class="view col spaced" style="gap: 2em">
    <BackButton v-if="page != 0" @click="prevPage"></BackButton>
    <div>
      <WelcomeView v-if="page == Page.Welcome"></WelcomeView>
      <NameView v-if="page == Page.Name"></NameView>
      <BirthdayView v-if="page == Page.Birthday"></BirthdayView>
      <LanguageView v-if="page == Page.Language"></LanguageView>
    </div>
    <div class="view-bottom col">
      <button v-if="page != 0" class="btn" @click="nextPage">Skip</button>
      <button class="btn" @click="nextPage">Continue</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NameView from './NameView.vue'
import BirthdayView from './BirthdayView.vue'
import LanguageView from './LanguageView.vue'
import WelcomeView from './WelcomeView.vue'
import { ref } from 'vue'
import { router } from '@/router'
import { useUserStore } from '@/stores/userStore'
import BackButton from '@/components/BackButton.vue'

enum Page {
  Welcome,
  Name,
  Birthday,
  Language,
  End,
}

const page = ref<Page>(0)

const prevPage = () => {
  page.value = Math.max(0, page.value - 1)
}

const nextPage = () => {
  page.value = page.value + 1
  if (page.value == Page.End) {
    useUserStore().setGuid()
    router.push({ name: 'home' })
  }
}
</script>

<style scoped></style>
