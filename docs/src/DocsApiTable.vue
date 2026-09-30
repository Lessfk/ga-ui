<template>
  <div class="doc-table-wrap">
    <table class="docs-api-table">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" scope="col">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[0]">
          <td v-for="(value, index) in row" :key="index">
            <code v-if="index < 2">{{ value }}</code>
            <span v-else>{{ value }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[]
  rows: string[][]
}>()
</script>

<style scoped>
.docs-api-table {
  min-width: 760px;
}

.docs-api-table td:first-child {
  white-space: nowrap;
}
</style>
