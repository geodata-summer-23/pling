<template>
	<h3>{{ $t().whatKindEvent }}</h3>
	<div class="col select">
		<select class="category-select" name="Kategori" id="category">
			<option value="Flood">{{ $t().flood }}</option>
			<option value="TorrentialRain">{{ $t().torrentialRain }}</option>
			<option value="Fire">{{ $t().fire }}</option>
			<option value="WindDamage">{{ $t().windDamage }}</option>
			<option value="Avalanche">{{ $t().avalanche }}</option>
			<option value="Other">{{ $t().other }}</option>
		</select>
	</div>

</template>

<script lang="ts" setup>
	import { $t } from '@/translation'
</script>

<style>

	.category-select {
		padding: 1em;
		appearance: initial;
		flex-shrink: 0;
	}

	
</style>