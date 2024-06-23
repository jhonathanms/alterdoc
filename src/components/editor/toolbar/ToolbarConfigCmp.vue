<template>
  <div class="flex flex-column gap-1 mt-2">
    <h3>Configurações</h3>
    <div class="flex flex-column gap-2">
      <label for="formato">Nome do projeto</label>
      <InputText id="formato" size="small" v-model="store.projeto.nomeProjeto" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="formato">Formato</label>
      <InputText id="formato" size="small" disabled v-model="store.projeto.formato" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="username">Host</label>
      <InputText size="small" v-model="store.projeto.host" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storageConstants } from '@/service/constants/storageConstants'
import type { IProjeto } from '@/model/IProjeto'
import storageService from '@/service/storageService'
import { useStoreBase } from '@/stores/storeBase'
import { onMounted } from 'vue'

const store = useStoreBase()

onMounted(() => {
  const projeto = storageService.getItem(storageConstants.PROJETO) as IProjeto

  if (!store.projeto.id && projeto) {
    store.setProjeto(projeto)
  }
})
</script>
