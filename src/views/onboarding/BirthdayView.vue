<template>
    <div class="view col">
      <input 
        id="birthday"
        type="date"
        placeholder="Birthday"
        :value="userStore.birthday"
        @change="userStore.setBirthday(($event.target as HTMLInputElement).valueAsDate)"
      >
    </div>
  
    <button @click="router.push({ name: 'birthdayReg' })">Next</button>
  
  </template>
  
  <script lang="ts" setup>
  import { router } from '@/router';
  import { useUserStore } from '@/stores/userStore';
  
  const userStore = useUserStore()
  
  </script>