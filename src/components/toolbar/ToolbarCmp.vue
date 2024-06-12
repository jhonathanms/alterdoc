<template>
  <div class="toolbar_base">
    <ToolbarLogoCmp />

    <div class="flex flex-column gap-2 h-full justify-content-between">
      <div class="flex flex-column">
        <span><strong>Projeto: </strong>API SPICE </span>
        <span><strong>Arquivo: </strong>Doc.apib</span>
      </div>

      <ToolbarConfigCmp />
      <ToolbarAcoesCmp />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import './style/style.scss';
</style>
