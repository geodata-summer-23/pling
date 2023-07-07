<template>
  <h2>{{ $t().selectLanguage }}</h2>
  <br />
  <br />
  <div class="col">
    <div class="row spaced center">
      <label for="norsk">Norsk</label>
      <input
        type="radio"
        id="norsk"
        name="language"
        value="norsk"
        :checked="userStore.language == 'norwegian'"
        @click="userStore.language = 'norwegian'"
      />
    </div>
    <hr />
    <div class="row spaced center">
      <label for="english">English</label>
      <input
        type="radio"
        id="english"
        name="language"
        value="english"
        :checked="userStore.language == 'english'"
        @click="userStore.language = 'english'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { $t } from '@/translation'
import { watch } from 'vue'

const emit = defineEmits<{
  (e: 'update-valid', valid: boolean): void
}>()
const userStore = useUserStore()

watch(
  () => [userStore.language],
  () => {
    emit('update-valid', !!userStore.language)
  },
  { immediate: true }
)
</script>

<style scoped>
label {
  padding: 1em 1em 1em 0em;
  width: 100%;
}

hr {
  color: gray;
  border-style: inset;
  border-width: 1px;
  margin-left: 0;
  margin-right: 0;
}
</style>
