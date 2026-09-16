<script setup lang="ts">
import { providePageOutline } from '../composables/usePageOutline'
import DocsHeader from './DocsHeader.vue'
import DocsSidebar from './DocsSidebar.vue'
import PageOutline from './PageOutline.vue'

providePageOutline()
</script>

<template>
  <div class="ga-docs-shell">
    <DocsHeader />
    <div class="ga-docs-shell__body">
      <DocsSidebar />
      <section class="ga-docs-shell__content">
        <RouterView />
      </section>
      <PageOutline />
    </div>
  </div>
</template>
