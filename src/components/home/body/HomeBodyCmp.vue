<template>
  <main class="container_body">
    <PanelHomeCmp v-if="store.togglePanelHome" />
    <RecentesCmp v-if="store.togglePanelHome && store.recentes.length" />
    <PanelFormCmp v-if="!store.togglePanelHome" />
  </main>
</template>

<script setup lang="ts">
import { storageConstants } from '@/service/constants/storageConstants'
import type { IRecentes } from '@/model/IProjeto'
import storageService from '@/service/storageService'
import { useStoreBase } from '@/stores/storeBase'
import { onMounted } from 'vue'
import PanelFormCmp from './components/PanelFormCmp.vue'
import PanelHomeCmp from './components/PanelHomeCmp.vue'
import RecentesCmp from './components/recentes/RecentesCmp.vue'

const store = useStoreBase()

onMounted(() => {
  const recentes = storageService.getItem(storageConstants.RECENTES) as IRecentes[]

  if (recentes) {
    store.recentes.splice(0, store.recentes.length, ...recentes)
  }
})
</script>

<style lang="scss" scoped>
@import 'primeflex/primeflex.scss';

.container_body {
  height: calc(100% - 100px);
  @include styleclass('flex flex-column w-full');
}
</style>
