<template>
  <h3>{{ $t().describeEvent }}</h3>

  <div class="col">
    <input id="eventDescription" type="text" :placeholder="$t().eventDescriptionText"/>
  </div>
    
</template>

<script lang="ts" setup>
	import { $t } from '@/translation'
</script>