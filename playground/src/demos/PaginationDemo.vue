<template>
  <section class="pagination-demo">
    <header>
      <h1>GaPagination 分页示例</h1>
      <p>对比默认配色与组件级颜色主题。</p>
    </header>

    <section class="pagination-demo__section">
      <h2>默认主题</h2>
      <GaPagination v-model:current-page="defaultPage" :total="80" position="left" />
    </section>

    <section class="pagination-demo__section">
      <h2>自定义主题</h2>
      <GaPagination v-model:current-page="customPage" :total="80" :theme="customTheme" :background="true"
        position="left" />
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
  GaPagination,
  type GaPaginationTheme,
} from "ga-ui-plus/base";

const defaultPage = ref(1);
const customPage = ref(1);

const customTheme: GaPaginationTheme = {
  backgroundColor: "#fafafa",
  textColor: "#606266",
  buttonColor: "#606266",
  buttonBackgroundColor: "#fafafa",
  activeColor: "#fff",
  activeBackgroundColor: "linear-gradient(135deg,#4b4b52, #1d1d22)",
  hoverColor: "#1c1c1a",
  hoverBackgroundColor: "#EDEDED",
  disabledColor: "#606266",
  disabledBackgroundColor: "#fafafa",
};
</script>

<style scoped lang="scss">
.pagination-demo {
  width: min(100%, 960px);
  padding: 32px;
  color: #101828;
}

header {
  margin-bottom: 32px;

  p {
    margin: 8px 0 0;
    color: #667085;
  }
}

h1 {
  margin: 0;
  font-size: 24px;
  letter-spacing: 0;
}

h2 {
  margin: 0 0 18px;
  font-size: 16px;
  letter-spacing: 0;
}

.pagination-demo__section {
  padding: 24px 0;
  border-top: 1px solid #eaecf0;
}
</style>
