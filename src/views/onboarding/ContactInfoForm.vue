<template>
  <h2>{{ $t().contactInfo }}</h2>
  <p>{{ $t().contactInfoParagraph }}</p>
  <div class="col" style="gap: 1em">
    <input
      type="tel"
      id="phone-number"
      placeholder="Phone number"
      :value="userStore.phoneNumber"
      @change="
        userStore.setPhoneNumber(($event.target as HTMLInputElement).value)
      "
    />
    <input
      type="email"
      id="email"
      placeholder="Email"
      :value="userStore.email"
      @change="userStore.setEmail(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { $t } from '@/translation'
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
