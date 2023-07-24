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
        @input="(e) => {
          const value = (e.target as HTMLInputElement).value
          day = value
          if (value.length == 2) {
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
        @input="(e) => {
          const value = (e.target as HTMLInputElement).value
          month = value
          if (value.length == 2) {
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
        @input="(e) => {
          const value = (e.target as HTMLInputElement).value
          year = value
          if (value.length == 4) {
            nextInput()
          }
        }"
        @keyup.enter="nextInput"
        @focus="currentInput = 2"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { $t } from '@/translation'
import { ref, watch, onMounted } from 'vue'

const formatDate = (date: Date | null) => {
  if (!date) return { dd: '', mm: '', yyyy: '' }
  const yyyy = date.getFullYear().toString()
  let mm = date.getMonth() + 1 // 0-indexed
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

const day = ref(formattedDate.dd)
const month = ref(formattedDate.mm)
const year = ref(formattedDate.yyyy)
const emit = defineEmits<{
  (e: 'update-valid', valid: boolean): void
}>()

const nextInput = () => {
  const elPrev = inputs[currentInput.value].value
  elPrev?.blur()
  currentInput.value += 1
  if (currentInput.value < inputs.length) {
    const el = inputs[currentInput.value].value
    if (!el) return
    el.value = ''
    el.focus()
  }
}

onMounted(() => {
  if (!dateInputRef.value || !monthInputRef.value || !yearInputRef.value) return
  dateInputRef.value.value = day.value
  monthInputRef.value.value = month.value
  yearInputRef.value.value = year.value
})

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
        parseInt(month.value) - 1, // 0-indexed
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
