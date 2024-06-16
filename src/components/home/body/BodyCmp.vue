<template>
  <PanelHomeCmp v-if="store.togglePanelHome" />
  <RecentesCmp v-if="store.togglePanelHome && store.recentes.length" />
  <PanelFormCmp v-if="!store.togglePanelHome" />
</template>

<script setup lang="ts">
import { storageConstants } from '@/service/constants/storageConstants'
import type { IRecentes } from '@/service/interfaces/IRecentes'
import storageService from '@/service/storageService'
import { useStoreBase } from '@/stores/storeBase'
import { onMounted } from 'vue'
import PanelFormCmp from './components/PanelFormCmp.vue'
import PanelHomeCmp from './components/PanelHomeCmp.vue'
import RecentesCmp from './components/recentes/RecentesCmp.vue'

const store = useStoreBase()

onMounted(() => {
  const data = storageService.getItem(storageConstants.RECENTES) as IRecentes[]

  if (data) {
    store.recentes.splice(0, store.recentes.length, ...data)
  }
})
</script>
