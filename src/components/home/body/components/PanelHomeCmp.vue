<template>
  <div class="flex flex-column w-full gap-4 pb-6 ">
    <span class="text-xl font-bold text-600">Como devemos prosseguir?</span>
    <FileUpload
      auto
      mode="basic"
      url="/import"
      accept=".apib"
      customUpload
      chooseLabel="Importar arquivo existente"
      @uploader="handleImportarArquivo"
      pt:chooseButton:class="h-4rem w-full text-lg"
    />
    <Button
      size="large"
      type="button"
      label="Criar novo"
      outlined
      severity="secondary"
      class="h-3rem w-full text-lg"
       @click="handleAbrirForm"
    />
  </div>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase'
import { useRouter } from 'vue-router'

const store = useStoreBase()
const router = useRouter()

const handleAbrirForm = () => {
  store.setTogglePanelHome();
}

const handleImportarArquivo = async (event: any) => {
  const file = event.files[0]

  if (file) {
    const reader = new FileReader()

    reader.onload = () => {
      const conteudo = reader.result as string

      store.setConteudoMD(conteudo)
      router.push({ path: '/editor' })
    }

    reader.readAsText(file)
  }
}
</script>
