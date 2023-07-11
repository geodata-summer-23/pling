<template>
  <h3>{{ $t().describeEvent }}</h3>

  <div class="col">
    <textarea id="eventDescription" type="text" :placeholder="$t().eventDescriptionText" @focusout="emit('description', ($event.target as HTMLTextAreaElement).value)"/>
  </div>
    
</template>

<script lang="ts" setup>
	import { $t } from '@/translation'

  const emit = defineEmits<{
    (e: 'description', des: string): void
  }>()

</script>

<style>

textarea {
  resize: none;
  padding: 1em;
  border-radius: 7px;
  border: 1px solid #000;
  height: 161px;
}

</style>