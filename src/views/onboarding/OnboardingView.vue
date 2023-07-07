<template>
  <div class="view col spaced" style="gap: 2em">
    <BackButton v-if="page != 0" @click="prevPage"></BackButton>
    <div>
      <WelcomeView
        v-if="page == Page.Welcome"
        @update-valid="valid = $event"
      ></WelcomeView>
      <NameView
        v-if="page == Page.Name"
        @update-valid="valid = $event"
      ></NameView>
      <BirthdayView
        v-if="page == Page.Birthday"
        @update-valid="valid = $event"
      ></BirthdayView>
      <LanguageView
        v-if="page == Page.Language"
        @update-valid="valid = $event"
      ></LanguageView>
    </div>
  </div>
  <div class="view-bottom col">
    <button v-if="page != 0" class="btn" @click="nextPage">Skip</button>
    <button
      class="btn"
      :class="{ blue: valid }"
      :disabled="!valid"
      @click="nextPage"
    >
      Continue
    </button>
  </div>
</template>

<script lang="ts" setup>
import NameView from './NameView.vue'
import BirthdayView from './BirthdayView.vue'
import LanguageView from './LanguageView.vue'
import WelcomeView from './WelcomeView.vue'
import BackButton from '@/components/BackButton.vue'
import { ref } from 'vue'
import { router } from '@/router'
import { useUserStore } from '@/stores/userStore'

enum Page {
  Welcome,
  Name,
  Birthday,
  Language,
  End,
}

const page = ref<Page>(0)
const valid = ref(false)

const prevPage = () => {
  valid.value = false
  page.value = Math.max(0, page.value - 1)
}

const nextPage = () => {
  valid.value = false
  if (page.value >= Page.End - 1) {
    useUserStore().setGuid()
    router.push({ name: 'home' })
  } else {
    page.value = page.value + 1
  }
}
</script>

<style scoped>
.blue {
  background-color: var(--c-light-blue);
  color: white;
}
</style>
