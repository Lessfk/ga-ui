<template>
  <div class="api-table__wrap">
    <table class="api-table">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            :class="{ 'is-code': isCodeColumn(cellIndex) }"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  headers: string[]
  rows: string[][]
}>()

/** 首列（名称）与“类型”列使用等宽代码样式 */
function isCodeColumn(index: number) {
  return index === 0 || props.headers[index] === '类型'
}
</script>

<style scoped lang="scss">
.api-table__wrap {
  margin: 0 0 20px;
  overflow-x: auto;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.api-table {
  width: 100%;
  font-size: 14px;
  border-spacing: 0;
  border-collapse: collapse;

  th {
    padding: 10px 14px;
    color: #909399;
    font-size: 13px;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
    background: #f8fafc;
    border-bottom: 1px solid #e4e7ed;
  }

  td {
    padding: 10px 14px;
    color: #606266;
    line-height: 1.7;
    vertical-align: top;
    border-bottom: 1px solid #ebeef5;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  td.is-code {
    color: #3451b2;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 13px;
    white-space: nowrap;
  }
}
</style>
