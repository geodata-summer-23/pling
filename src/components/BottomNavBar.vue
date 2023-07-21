<template>
  <nav
    v-if="['home', 'map', 'network'].includes(router.currentRoute.value.name as string)"
    class="nav-bottom"
  >
    <RouterLink :to="{ name: 'home' }">
      <NavItem route="home"><fa-icon size="xl" icon="house" /></NavItem>
    </RouterLink>
    <RouterLink :to="{ name: 'map' }">
      <NavItem route="map"><fa-icon size="xl" icon="earth-americas" /></NavItem>
    </RouterLink>
    <RouterLink :to="{ name: 'network' }">
      <NavItem route="network"><fa-icon size="xl" icon="bell" /></NavItem>
    </RouterLink>
  </nav>
</template>

<script lang="ts" setup>
import NavItem from '@/components/NavItem.vue'
import { router } from '@/router'
</script>
