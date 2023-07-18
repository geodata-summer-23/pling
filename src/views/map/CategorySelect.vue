<template>
  <h3 style="text-align: center">
    {{ $t().category }}
  </h3>
  <div class="layer-grid">
    <div
      v-for="option in getCategoryOptions()"
      class="layer-item col center clickable"
      :class="{
        selected: selectedCategory.title == option.title,
        disabled: option.layerId == 'NotImplementedError',
      }"
      @click="() => onLayerOptionSelect(option)"
    >
      <span>
        {{ option.title }}
      </span>
      <fa-icon size="xl" :icon="option.faIcon"></fa-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PromptModalContent from '@/components/PromptModalContent.vue'
import { CategoryOption, getCategoryOptions } from '@/scripts/category'
import { useModalStore } from '@/stores/modalStore'
import { $t } from '@/translation'

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
      title: $t().category + ': ' + categoryOption.title,
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
  padding: 1em 0.5em;
  border-radius: 0.5em;
  white-space: nowrap;
  color: var(--c-blue);
}
.layer-item.selected {
  background-color: var(--c-dark-gray);
}

div.disabled {
  color: var(--c-dark-gray);
}
</style>
./map @/translation @/translation
