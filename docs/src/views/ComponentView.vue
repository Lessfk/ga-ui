<script setup lang="ts">
import { computed } from 'vue'

import { componentCatalog } from '../content/catalog'

const props = defineProps<{ slug: string }>()
const component = computed(() =>
  componentCatalog.find((item) => item.slug === props.slug),
)
</script>

<template>
  <main v-if="component" class="ga-docs-page">
    <h1>{{ component.title }}</h1>
    <p>{{ component.description }}</p>
  </main>
</template>
