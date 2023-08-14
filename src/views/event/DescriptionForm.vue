<template>
  <h3>{{ $t().describeEvent }}</h3>

  <div v-if="type == 'event'" class="col" style="gap: 1em">
    <div v-for="(question, i) in questions" class="row spaced">
      <label :for="`checkbox-${i}`">{{ question.q }}</label>
      <input type="checkbox" :id="`checkbox-${i}`" v-model="question.a" />
    </div>
  </div>

  <br />
  <p>
    {{
      type == 'event'
        ? $t().eventDescriptionText
        : $t().helpRequestDescriptionText
    }}
  </p>
  <div class="col">
    <textarea
      id="eventDescription"
      type="text"
      :placeholder="
        type == 'event'
          ? $t().eventDescriptionExample
          : $t().helpRequestDescriptionExample
      "
      @input="
        wordCount = ($event.target as HTMLInputElement).value.split(' ').length
      "
      v-model="eventDescription"
    />
  </div>
  <div class="row" style="justify-content: end">
    <span>{{ wordCount }} / 50</span>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import { onUnmounted, ref } from 'vue'

defineProps<{
  type: 'event' | 'helpRequest'
}>()

const emit = defineEmits<{
  (e: 'description', des: string): void
}>()

const wordCount = ref(0)

let eventDescription = ''

const questions = [
  { q: 'Det er fare for liv og helse.', a: false },
  { q: 'Det er fare for eiendom eller infrastruktur.', a: false },
]

onUnmounted(() => {
  let description = ''

  questions.forEach((question) => {
    if (question.a) {
      description = description.concat(' ', question.q)
    }
  })

  description = description.concat(' ', eventDescription)

  emit('description', description)
})
</script>

<style scoped>
textarea {
  resize: none;
  padding: 1em;
  border-radius: 7px;
  border: 1px solid #000;
  height: 6em;
}

/* input[type='checkbox'] {
  transform: scale(2);
} */
</style>
