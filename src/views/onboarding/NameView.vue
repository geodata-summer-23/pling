<template>
  <h2>Tell us a bit about yourself</h2>
  <div class="col" style="gap: 1em">
    <input
      id="given-name"
      type="text"
      placeholder="First name"
      :value="userStore.firstName"
      @change="
        userStore.setFirstName(($event.target as HTMLInputElement).value)
      "
    />
    <input
      id="family-name"
      type="text"
      placeholder="Last name"
      :value="userStore.lastName"
      @change="userStore.setLastName(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { watch } from 'vue'

const emit = defineEmits<{
  (e: 'update-valid', valid: boolean): void
}>()
const userStore = useUserStore()

watch(
  () => [userStore.firstName, userStore.lastName],
  () => {
    emit('update-valid', !!userStore.firstName && !!userStore.lastName)
  },
  { immediate: true }
)
</script>
