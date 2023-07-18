<template>
  <h3>{{ $t().overview }}</h3>
  <HelpRequestBox :helpRequest="helpRequest"></HelpRequestBox>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import HelpRequestBox from './HelpRequestBox.vue'
import { HelpRequest } from '@/stores/helpRequestStore'

defineProps<{ helpRequest: HelpRequest }>()
</script>
