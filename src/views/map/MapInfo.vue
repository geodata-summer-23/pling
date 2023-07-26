<template>
  <div class="col" @click="useModalStore().pop()">
    <h3>{{ category.title }}</h3>
    <p v-html="category.info.description"></p>
    <h4 style="margin-top: 1em">Tegnforklaring</h4>
    <div v-for="legend in category.info.legends">
      <h5>{{ legend.title }}</h5>
      <div v-for="item in legend.items" class="row">
        <svg viewBox="0 0 4 4" style="width: 1.2em">
          <rect
            v-if="item.shape == 'line'"
            y="1"
            width="4"
            height="2"
            rx="0.8"
            :fill="item.color"
          />
          <polygon
            v-else-if="item.shape == 'arrow'"
            points="2,2 0,0 2,0 4,2 2,4 0,4"
            :fill="item.color"
          />
          <circle v-else cx="2" cy="2" r="2" :fill="item.color" />
        </svg>
        <span>{{ item.text }}</span>
      </div>
      <br />
    </div>
    <div class="row center">
      <img
        v-if="category.info.img"
        :src="category.info.img"
        alt="compass"
        width="140"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CategoryOption } from '@/scripts/category'
import { useModalStore } from '@/stores/modalStore'

defineProps<{
  category: CategoryOption
}>()
</script>

<style scoped>
h3,
h4,
h5,
p {
  margin: 0;
}

p,
span {
  font-size: 10pt;
}

h3,
h4 {
  text-align: center;
}

svg {
  margin-inline: 0.5em;
}
</style>
