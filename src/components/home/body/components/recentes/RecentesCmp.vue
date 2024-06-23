<template>
  <div class="flex flex-column gap-2 w-full pt-6 overflow-hidden">
    <span class="text-sm text-500">Trabalhos recentes: </span>

    <div class="flex flex-column w-full gap-2 max-h-10rem overflow-y-auto">
      <div v-for="item in store.recentes" :key="item.id">
        <HomeCardItemCmp :props="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase'
import HomeCardItemCmp from './HomeCardItemCmp.vue'

const store = useStoreBase()
</script>
