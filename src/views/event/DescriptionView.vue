<template>
  <h3>{{ $t().describeEvent }}</h3>

  <div class="col" style="gap: 1em">
    <div v-for="(question, i) in questions" class="row spaced">
      <label :for="`checkbox-${i}`">{{ question }}</label>
      <input type="checkbox" :id="`checkbox-${i}`" />
    </div>
  </div>

  <br />
  <p>{{ $t().eventDescriptionText }}</p>
  <div class="col">
    <textarea
      id="eventDescription"
      type="text"
      placeholder="..."
      @focusout="
        emit('description', ($event.target as HTMLTextAreaElement).value)
      "
      @input="
        wordCount = ($event.target as HTMLInputElement).value.split(' ').length
      "
    />
  </div>
  <div class="row" style="justify-content: end">
    <span>{{ wordCount }} / 50</span>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'description', des: string): void
}>()

const wordCount = ref(0)

const questions = [
  'Det er fare for liv og helse.',
  'Det er fare for private eiendeler.',
  'Det er fare for eiendom eller infrastruktur.',
  'Jeg ønsker hjelp fra noen i nærheten.',
]
</script>

<style scoped>
textarea {
  resize: none;
  padding: 1em;
  border-radius: 7px;
  border: 1px solid #000;
  height: 4em;
}

input[type='checkbox'] {
  transform: scale(2);
}
</style>
