<template>
  <div class="flex flex-column w-full h-20rem">
    <span class="text-xl font-bold text-600">Preencha os dados a seguir:</span>

    <div class="flex flex-column gap-3 mt-4 pb-4 px-2 overflow-y-auto">
      <div class="flex flex-column gap-2">
        <label for="formato">Nome do projeto</label>
        <InputText id="formato" size="small" v-model="store.projeto.nomeProjeto" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="formato">Nome do arquivo</label>
        <InputText
          id="formato"
          size="small"
          placeholder="default: doc.apib"
          v-model="store.projeto.nomeArquivo"
        />
      </div>
      <div class="flex flex-column gap-2">
        <label for="username">Formato</label>
        <InputText
          size="small"
          disabled
          placeholder="default: 1A"
          v-model="store.projeto.formato"
        />
      </div>
      <div class="flex flex-column gap-2">
        <label for="username">Host</label>
        <InputText
          size="small"
          placeholder="ex.: http://127.0.0.1:8877/v1"
          v-model="store.projeto.host"
        />
      </div>
    </div>

    <div class="flex gap-2 justify-content-between mt-2">
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
        :disabled="isFormInvalido"
        @click="handleFinalizar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storageConstants } from '@/service/constants/storageConstants'
import storageService from '@/service/storageService'
import { useStoreBase } from '@/stores/storeBase'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

const router = useRouter()
const store = useStoreBase()

const handleFinalizar = () => {
  const projeto = { id: uuidv4(), ...store.projeto }
  
  storageService.setItem(storageConstants.PROJETO, projeto)

  router.push({ path: '/editor' })
}

const isFormInvalido = computed(() => {
  return !(
    !!store.projeto.nomeProjeto &&
    !!store.projeto.nomeArquivo &&
    !!store.projeto.formato &&
    !!store.projeto.host
  )
})

const handleVoltar = () => {
  store.setTogglePanelHome()
}

onMounted(() => {
  document.getElementById('formato')?.focus()
})
</script>

<style scoped lang="scss">
label {
  font-size: small;
}
</style>
