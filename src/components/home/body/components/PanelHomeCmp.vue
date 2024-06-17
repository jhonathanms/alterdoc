<template>
  <div class="flex flex-column w-full gap-4">
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
import { storageConstants } from '@/service/constants/storageConstants';
import type { IProjeto } from '@/service/interfaces/IProjeto';
import storageService from '@/service/storageService';
import { useStoreBase } from '@/stores/storeBase';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router';

const store = useStoreBase()
const router = useRouter()

const handleAbrirForm = () => {
  store.setTogglePanelHome()
}

function extractFormatAndHost(markdown: string): { format: string; host: string, title: string } {
  const formatMatch = markdown.match(/FORMAT:\s*(\S+)/)
  const hostMatch = markdown.match(/HOST:\s*(\S+)/)
  const titleMatch = markdown.match(/^#\s*(.+)/m)

  return {
    format: formatMatch ? formatMatch[1] : '',
    host: hostMatch ? hostMatch[1] : '',
    title: titleMatch ? titleMatch[1] : '',
  }
}

const handleImportarArquivo = async (event: any) => {
  const file = event.files[0]

  if (file) {
    const reader = new FileReader()

    reader.onload = () => {
      const conteudo = reader.result as string
      const data = extractFormatAndHost(conteudo)

      const projeto: IProjeto = {
        id: uuidv4(),
        formato: data.format,
        host: data.host,
        nomeArquivo: file.name,
        nomeProjeto: data.title
      }

      storageService.setItem(storageConstants.PROJETO, projeto)
      store.setProjeto(projeto)
      store.setConteudoMD(conteudo)
      router.push({ path: '/editor' })
    }

    reader.readAsText(file)
  }
}
</script>
