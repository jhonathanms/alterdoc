<template>
  <div class="toolbar_base">
    <ToolbarLogoCmp />

    <div class="flex flex-column gap-2 h-full justify-content-between mt-2">
      <div class="flex flex-column">
        <span><strong>Arquivo: </strong>{{ store.projeto?.nomeArquivo }}</span>
        <span v-show="store.projeto?.local"><strong>Local: </strong>{{ store.projeto?.local }}</span>
        <ToolbarConfigCmp />
      </div>

      <ToolbarAcoesCmp />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase'
import ToolbarConfigCmp from './ToolbarConfigCmp.vue'

const store = useStoreBase()
</script>

<style lang="scss">
@import './style/style.scss';
</style>
