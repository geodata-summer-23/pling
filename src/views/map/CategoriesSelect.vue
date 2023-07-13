<template>
  <h3 style="text-align: center">
    {{ $t().category }}
  </h3>
  <div class="layer-grid">
    <div
      v-for="option in getCategoryOptions()"
      class="layer-item row center clickable"
      :class="{
        selected: selectedCategory.displayTitle == option.displayTitle,
        disabled: option.layerId == 'NotImplementedError',
      }"
      @click="() => onLayerOptionSelect(option)"
    >
      {{ option.displayTitle }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import PromptModalContent from '@/components/PromptModalContent.vue'
import { useModalStore } from '@/stores/modalStore'
import { $t } from '@/translation'
import { CategoryOption, getCategoryOptions } from './map'

defineProps<{
  selectedCategory: CategoryOption
}>()

const emit = defineEmits<{
  (e: 'select-category', category: CategoryOption): void
}>()

const onLayerOptionSelect = (categoryOption: CategoryOption) => {
  useModalStore().push(
    PromptModalContent,
    {
      title: $t().category + ': ' + categoryOption.displayTitle,
      text: categoryOption.description,
      buttons: [
        {
          text: $t().cancel,
          click: () => {
            useModalStore().pop()
          },
        },
        {
          text: $t().show,
          click: () => {
            emit('select-category', categoryOption)
            useModalStore().pop()
            useModalStore().pop()
          },
        },
      ],
    },
    {}
  )
}
</script>

<style scoped>
.layer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 1em;
  column-gap: 1em;
}

.layer-item {
  background-color: var(--c-light-gray);
  padding: 1em;
  border-radius: 0.5em;
  white-space: nowrap;
}
.layer-item.selected {
  background-color: var(--c-dark-gray);
}

div.disabled {
  color: var(--c-dark-gray);
}
</style>
./map
