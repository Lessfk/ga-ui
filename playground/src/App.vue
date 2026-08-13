


<template>
  <main class="playground-page">
    <!-- <TablePaginationDemo /> -->
    <!-- <DialogDemo /> -->
    <!-- <PaginationDemo /> -->
    <AsideMenuDemo />
  </main>
</template>

<script setup lang="ts">
import AsideMenuDemo from "./demos/AsideMenuDemo.vue";
import TablePaginationDemo from "./demos/TablePaginationDemo.vue";
import DialogDemo from "./demos/DialogDemo.vue";
import PaginationDemo from "./demos/PaginationDemo.vue";
import SapphireMenuDemo from "./demos/SapphireMenuDemo.vue";
import ElegantMenuDemo from "./demos/ElegantMenuDemo.vue";
import OrientalMenuDemo from "./demos/OrientalMenuDemo.vue";

</script>

<style scoped lang="scss">
.playground-page {
  display: flex;
  flex-direction: column;
  width: 80vw;
  height: 80vh;
  min-height: 0;
  margin: 0 auto;
}
</style>
