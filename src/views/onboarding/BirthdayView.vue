<template>
  <h2>{{ $t().whatsYourBirthdate }}</h2>
  <div class="col">
    <div class="row" style="gap: 1em">
      <input
        id="date"
        placeholder="DD"
        minlength="2"
        maxlength="2"
        v-model="day"
      />
      <input
        id="month"
        placeholder="MM"
        minlength="2"
        maxlength="2"
        v-model="month"
      />
      <input
        id="year"
        placeholder="YYYY"
        minlength="4"
        maxlength="4"
        v-model="year"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { $t } from '@/translation'
import { ref, watch } from 'vue'

const formatDate = (date: Date | null) => {
  if (!date) return { dd: '', mm: '', yyyy: '' }
  const yyyy = date.getFullYear().toString()
  let mm = date.getMonth()
  let dd = date.getDate()

  return {
    dd: (dd < 10 ? '0' : '') + dd,
    mm: (mm < 10 ? '0' : '') + mm,
    yyyy,
  }
}

const userStore = useUserStore()

const formattedDate = formatDate(userStore.birthday)
const day = ref(formattedDate.dd)
const month = ref(formattedDate.mm)
const year = ref(formattedDate.yyyy)
const emit = defineEmits<{
  (e: 'update-valid', valid: boolean): void
}>()

watch(
  () => [day.value, month.value, year.value],
  () => {
    if (!year.value || !month.value || !day.value) {
      emit('update-valid', false)
      return
    }
    try {
      const date = new Date(
        parseInt(year.value),
        parseInt(month.value),
        parseInt(day.value)
      )
      userStore.setBirthday(date)
      emit('update-valid', true)
    } catch {
      emit('update-valid', false)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
input {
  max-width: 4em;
}
</style>
