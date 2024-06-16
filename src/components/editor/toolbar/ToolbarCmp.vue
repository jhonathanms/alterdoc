<template>
  <div class="toolbar_base">
    <ToolbarLogoCmp />

    <div class="flex flex-column gap-2 h-full justify-content-between mt-4">
      <div class="flex flex-column">
        <span><strong>Projeto: </strong>API SPICE </span>
        <span><strong>Arquivo: </strong>Doc.apib</span>
        <ToolbarConfigCmp />
      </div>

      <ToolbarAcoesCmp />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolbarConfigCmp from './ToolbarConfigCmp.vue';
</script>

<style lang="scss">
@import './style/style.scss';
</style>
