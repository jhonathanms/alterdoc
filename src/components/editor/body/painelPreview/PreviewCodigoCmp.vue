<template>
  <div class="w-full overflow-auto p-1">
    <div v-if="store.markdown" class="container_codigo h-full">{{ store.markdown }}</div>
    <div v-else class="flex align-items-center justify-content-center w-full h-full surface-200">
      <div class="flex align-items-center flex-column gap-3">
        <img
          class="text-primary"
          alt="icone conteudo não encontrado"
          src="../../../../assets/icon/icon-nao-encontrado.svg"
          width="80px"
        />
        <span class="text-gray-500">Nenhum conteúdo Markdown encontrado.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase'

const store = useStoreBase()
</script>

<style scoped lang="scss">
.container_codigo {
  font-family: 'Courier New', Courier, monospace;
  font-size: small;
  white-space: pre-wrap;
  text-wrap: balance;
  overflow-x: auto;
  background: #eeeeee;
  padding: 10px;
  display: block;
  height: 100%;
  word-break: break-all;
}
</style>
