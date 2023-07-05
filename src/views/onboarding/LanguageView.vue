<template>
    <div class="view col">
      <p>Select language</p>
    </div>
  
    <button @click="router.push({ name: 'user' })">Done</button>
  </template>
  
  <script lang="ts" setup>
  import { router } from '@/router'
  
  </script>