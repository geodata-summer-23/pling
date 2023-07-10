<template>
	<h3>{{ $t().whatKindEvent }}</h3>
	<div class="col select">
		<select class="category-select" name="Kategori" id="category" @change="emit('category', ($event.target as HTMLSelectElement).value as CategoryState)">
			<option value='flood'>{{ $t().flood }}</option>
			<option value='torrentialRain'>{{ $t().torrentialRain }}</option>
			<option value='fire'>{{ $t().fire }}</option>
			<option value='wind'>{{ $t().windDamage }}</option>
			<option value='avalanche'>{{ $t().avalanche }}</option>
			<option value='other'>{{ $t().other }}</option>
		</select>
	</div>

</template>

<script lang="ts" setup>
  import { $t } from '@/translation'
import { CategoryState } from './EventView.vue';

  const emit = defineEmits<{
    (e: 'category', cat: CategoryState): void
  }>()
 
</script>

<style>

	.category-select {
		padding: 1em;
		appearance: initial;
		flex-shrink: 0;
	}

	
</style>