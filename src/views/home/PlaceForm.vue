<template>
  <label for="nickname">{{ $t().name }}</label>
  <input
    type="text"
    id="nickname"
    placeholder="Min lokasjon"
    v-model="place.nickname"
  />
  <br />
  <label>{{ $t().address }}</label>
  <div class="row spaced">
    <input
      type="text"
      disabled="true"
      placeholder="Schweigaards gate 28, 0191 Oslo"
      v-model="place.address.street"
    />
    <div>
      <IconButton
        icon="search"
        class="btn-shadow"
        @click="onSearch"
      ></IconButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Place } from '@/stores/placeStore'
import { watch } from 'vue'
import { $t } from '@/translation'
import IconButton from '@/components/IconButton.vue'
import { useModalStore } from '@/stores/modalStore'
import SearchModalContent from '@/components/SearchModalContent.vue'

const props = defineProps<{ place: Place; edit: boolean }>()
const emit = defineEmits<{
  (e: 'toggleSubmit', enabled: boolean): void
}>()

const onSearch = () => {
  useModalStore().push(
    SearchModalContent,
    { place: props.place },
    {
      select: () => {
        useModalStore().pop()
      },
    }
  )
}

const tryToggleSubmit = (enabled: boolean = false) => {
  if (!props.place.nickname) {
    emit('toggleSubmit', false)
    return
  }
  if (props.edit) {
    emit('toggleSubmit', true)
    return
  }
  emit('toggleSubmit', enabled)
}

watch(
  () => props.place.nickname,
  () => {
    tryToggleSubmit(true)
  },
  { immediate: true }
)
</script>

<style scoped>
input {
  min-width: 20px;
}
</style>
