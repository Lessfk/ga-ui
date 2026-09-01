<template>
  <div class="playground-scroll">
    <!-- <MegaMenuDemo />
    <div class="demo-divider" />
    <MySearchBarDemo />
    <div class="demo-divider" />
    <TablePaginationDemo /> -->

    <!-- <DialogDemo></DialogDemo> -->

    <MySearchBarDemo></MySearchBarDemo>
  </div>
</template>

<script setup lang="ts">
import MegaMenuDemo from './demos/MegaMenuDemo.vue'
import TablePaginationDemo from './demos/TablePaginationDemo.vue'
import MySearchBarDemo from './demos/MySearchBarDemo.vue'
import DialogDemo from './demos/DialogDemo.vue'
</script>

<style scoped>
.playground-scroll {
  height: 100%;
  overflow: auto;
}

.demo-divider {
  height: 1px;
  background: #cfd6df;
}
</style>
