<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="ga-demo-preview">
    <header v-if="title || description" class="ga-demo-preview__header">
      <strong v-if="title" class="ga-demo-preview__title">{{ title }}</strong>
      <p v-if="description" class="ga-demo-preview__description">
        {{ description }}
      </p>
    </header>

    <div class="ga-demo-preview__body">
      <slot />
    </div>
  </section>
</template>
