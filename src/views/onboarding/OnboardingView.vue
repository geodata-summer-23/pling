<template>
  <div class="view col spaced">
    <div>
      <WelcomeView v-if="page == Page.Welcome"></WelcomeView>
      <NameView v-if="page == Page.Name"></NameView>
      <BirthdayView v-if="page == Page.Birthday"></BirthdayView>
      <LanguageView v-if="page == Page.Language"></LanguageView>
    </div>
    <div class="bottom">
      <div class="row spaced" style="gap: 10em">
        <!-- <button v-if="page != 0" @click="prevPage">Back</button> -->
        <button @click="nextPage">Continue</button>
      </div>
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

enum Page {
  Welcome,
  Name,
  Birthday,
  Language,
  End,
}

const page = ref<Page>(0)

// const prevPage = () => {
//   page.value = Math.max(0, page.value - 1)
// }

const nextPage = () => {
  page.value = page.value + 1
  if (page.value == Page.End) {
    useUserStore().setGuid()
    router.push({ name: 'root' })
  }
}
</script>

<style scoped>
.bottom {
  position: absolute;
  bottom: 2em;
}
</style>
