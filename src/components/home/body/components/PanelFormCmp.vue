<template>
  <div class="flex flex-column w-full">
    <span class="text-xl font-bold text-600">Preencha os dados a seguir:</span>

    <div class="flex flex-column gap-3 mt-4">
      <div class="flex flex-column gap-2 ">
        <label for="formato">Nome do projeto</label>
        <InputText id="formato" size="small" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="formato">Nome do arquivo</label>
        <InputText id="formato" size="small" modelValue="doc.apib" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="username">Formato</label>
        <InputText size="small" modelValue="1A" disabled/>
      </div>
      <div class="flex flex-column gap-2">
        <label for="username">Host</label>
        <InputText size="small" placeholder="http://127.0.0.1:8877/v1" />
      </div>
    </div>

    <div class="flex gap-2 justify-content-between mt-4">
      <Button
        label="Voltar"
        text
        severity="secondary"
        icon="pi pi-arrow-left"
        iconPos="left"
        @click="handleVoltar"
      />
      <Button
        label="Finalizar"
        severity="primary"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="handleAbrirEditor"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const store = useStoreBase()

const handleAbrirEditor = () => {
  router.push({ path: '/editor' })
}

const handleVoltar = () => {
  store.setTogglePanelHome();
}

onMounted(() => {
  document.getElementById('formato')?.focus();
})
</script>

<style>
label {
  font-size: small;
}
</style>
