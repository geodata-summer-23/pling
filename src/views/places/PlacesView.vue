<template>
  <div class="view">
    <div class="col">
      <SearchBar></SearchBar>
      <div v-for="address in userStore.addresses" class="address-item">
        {{ address }}
      </div>
    </div>
    <button>Add</button>
  </div>
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<style>
.address-item {
}
</style>
