<template>
  <h2>{{ $t().whatsYourBirthdate }}</h2>
  <div class="col">
    <div class="row" style="gap: 1em">
      <input
        type="tel"
        id="date"
        ref="dateInputRef"
        placeholder="DD"
        minlength="2"
        maxlength="2"
        v-model="day"
        @input="(e) => {
          if ((e.target as HTMLInputElement).value.length == 2) {
            nextInput()
          }
        }"
        @keyup.enter="nextInput"
        @focus="currentInput = 0"
      />
      <input
        type="tel"
        id="month"
        ref="monthInputRef"
        placeholder="MM"
        minlength="2"
        maxlength="2"
        v-model="month"
        @input="(e) => {
          if ((e.target as HTMLInputElement).value.length == 2) {
            nextInput()
          }
        }"
        @keyup.enter="nextInput"
        @focus="currentInput = 1"
      />
      <input
        type="tel"
        id="year"
        ref="yearInputRef"
        placeholder="YYYY"
        minlength="4"
        maxlength="4"
        v-model="year"
        @focus="currentInput = 2"
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
const dateInputRef = ref<HTMLInputElement>()
const monthInputRef = ref<HTMLInputElement>()
const yearInputRef = ref<HTMLInputElement>()
const currentInput = ref(0)
const inputs = [dateInputRef, monthInputRef, yearInputRef]

const nextInput = () => {
  currentInput.value = (currentInput.value + 1) % 3
}

watch(
  () => currentInput.value,
  () => {
    const el = inputs[currentInput.value].value
    if (!el) return
    el.value = ''
    el.focus()
  }
)

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
