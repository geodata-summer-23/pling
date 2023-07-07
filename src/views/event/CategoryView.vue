<template>
	<h3>Hvilken type hendelse gjelder det?</h3>
	<div class="col select">
		<select class="category-select" name="Kategori" id="category">
			<option value="Flood">Flom</option>
			<option value="TorrentialRain">Styrt regn</option>
			<option value="Fire">Brann</option>
			<option value="WindDamage">Skade fra vind</option>
			<option value="Avalanche">Skred</option>
			<option value="Other">Annet</option>
		</select>
	</div>

</template>

<style>

	.category-select {
		padding: 1em;
		appearance: initial;
		flex-shrink: 0;
	}

	
</style>