<template>
    <div class="view col">
      <p>Select language</p>
    </div>

    <div>
      <input type="radio" id="norsk" name="language" value="Norsk">
      <label for="norsk">Norsk</label><br>

      <input type="radio" id="english" name="language" value="English">
      <label for="english">English</label>


    </div>
  
    <button @click="router.push({ name: 'user' })">Done</button>
  </template>
  
  <script lang="ts" setup>
  import { router } from '@/router'
  
  </script>