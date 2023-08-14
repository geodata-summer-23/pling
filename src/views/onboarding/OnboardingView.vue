<template>
  <div class="view col spaced" style="gap: 1em">
    <IconButton v-if="page != 0" @click="prevPage"></IconButton>
    <ProgressBar :number="Page.End" :index="page"></ProgressBar>
    <div>
      <WelcomeForm
        v-if="page == Page.Welcome"
        @update-valid="valid = $event"
      ></WelcomeForm>
      <LanguageForm
        v-if="page == Page.Language"
        @update-valid="valid = $event"
      ></LanguageForm>
      <NameForm
        v-if="page == Page.Name"
        @update-valid="valid = $event"
      ></NameForm>
      <BirthdayForm
        v-if="page == Page.Birthday"
        @update-valid="valid = $event"
      ></BirthdayForm>
      <ContactInfoForm
        v-if="page == Page.ContactInfo"
        @update-valid="valid = $event"
      ></ContactInfoForm>
    </div>
  </div>
  <div class="view-bottom col">
    <button v-if="page != 0" class="btn" @click="nextPage">
      {{ $t().skip }}
    </button>
    <button
      class="btn"
      :class="{ blue: valid }"
      :disabled="!valid"
      @click="nextPage"
    >
      {{ $t().continue }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import NameForm from './NameForm.vue'
import BirthdayForm from './BirthdayForm.vue'
import LanguageForm from './LanguageForm.vue'
import WelcomeForm from './WelcomeForm.vue'
import IconButton from '@/components/IconButton.vue'
import ContactInfoForm from './ContactInfoForm.vue'
import { ref } from 'vue'
import { router } from '@/router'
import { useUserStore } from '@/stores/userStore'
import { $t } from '@/translation'
import ProgressBar from '@/components/ProgressBar.vue'

enum Page {
  Welcome,
  Language,
  Name,
  Birthday,
  ContactInfo,
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
  color: var(--c-white);
}
</style>
