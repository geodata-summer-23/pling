<template>
    <div class="view col">
      <input 
        id="birthday"
        type="date"
        :value="userStore.birthday?.toISOString().split('t')[0]"
        @change="userStore.setBirthday(($event.target as HTMLInputElement).valueAsDate)"
      >
    </div>
  
    <button @click="router.push({ name: 'user' })">Done</button>
  
  </template>
  
  <script lang="ts" setup>
  import { router } from '@/router';
  import { useUserStore } from '@/stores/userStore';
  
  const userStore = useUserStore()
  
  </script>