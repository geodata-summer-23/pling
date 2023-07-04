<template>
  <div class="search-container">
    <input
      type="text"
      :placeholder="placeholder"
      :value="searchString"
      @input="(event) => {
        searchString = (event.target as HTMLInputElement).value;
        emit('input', searchString);
      }"
      @keydown.enter="(event) => {
        if (results.length > 0) {
          emit('select', results[0])
        }
        (event.target as HTMLInputElement).blur();
        searchString = '';
      }"
    />
    <div v-if="results.length > 0" class="result-container col">
      <div
        v-for="result in results"
        class="result"
        @click="
          () => {
            emit('select', result)
            searchString = ''
          }
        "
      >
        {{ result.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

export type SearchResult = {
  title: string
  data?: Record<string, any>
}

const searchString = ref('')

withDefaults(
  defineProps<{
    placeholder: string
    results: SearchResult[]
  }>(),
  { placeholder: 'Search..', results: () => [] }
)

const emit = defineEmits<{
  (e: 'input', searchString: string): void
  (e: 'select', result: SearchResult): void
}>()
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.result-container {
  position: absolute;
  background-color: #f3f3f3;
}

.result {
  padding: 0.5em 1.5em;
  cursor: pointer;
}

.result:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
