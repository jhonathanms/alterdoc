<template>
  <div class="flex flex-column gap-2">
    <Button
      type="button"
      size="small"
      class="w-full"
      label="Salvar"
      severity="secondary"
      badge="CTRL + S"
      :pt="{
        badge: {
          class: 'absolute top-0 right-0',
          style: { background: '#FFFFFF00', color: 'var(--bg-danger-alhpa-90)', fontSize: '9px' }
        }
      }"
      @click="handleSalvar"
      @keyup="handleKeydown"
    />
    <Button
      type="button"
      size="small"
      class="w-full"
      label="Exportar json"
      outlined
      severity="secondary"
      badge="CTR + E"
      :pt="{
        badge: {
          class: 'absolute top-0 right-0',
          style: { background: '#FFFFFF00', color: 'var(--bg-danger-alhpa-90)', fontSize: '9px' }
        }
      }"
      @click="exportarJson"
      @keyup="handleKeydown"
    />
    <Button
      type="button"
      size="small"
      class="w-full"
      label="Cancelar"
      outlined
      severity="secondary"
      @click="abrirDialog"
    />
    <ConfirmDialogCmp />
  </div>
</template>

<script setup lang="ts">
import type { IProjeto } from '@/model/IProjeto'
import { storageConstants } from '@/constants/storageConstants'
import storageService from '@/service/storageService'
import { useStoreBase } from '@/stores/storeBase'
import { useConfirm } from 'primevue/useconfirm'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialogCmp from './ConfirmDialogCmp.vue'
import type { FilePickerOptions } from 'env';

const router = useRouter()
const store = useStoreBase()
const confirm = useConfirm()

const cancelar = () => {
  store.setProjeto({} as IProjeto)
  store.setTogglePanelHome(true)
  storageService.remove(storageConstants.PROJETO)
  router.push({ path: '/' })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    handleSalvar()
  }

  if (event.ctrlKey && event.key === 'e') {
    event.preventDefault()
    exportarJson()
  }
}

const handleSalvar = async () => {
  const blob = new Blob([store.markdown], { type: 'text/markdown' })

  try {
    const options: FilePickerOptions = {
      suggestedName: store.projeto.nomeArquivo,
      types: [
        {
          description: 'Arquivo markdown blueprint',
          accept: {
            'text/markdown': ['.apib']
          }
        }
      ]
    };

    const fileHandle = await window.showSaveFilePicker(options)
    const writable = await fileHandle.createWritable()
    await writable.write(blob)
    await writable.close()
  } catch (error) {
    console.error('Erro ao salvar o arquivo:', error)
  }
}

const abrirDialog = () => {
  confirm.require({
    group: 'headless',
    header: 'Deseja realmente sair?',
    message: '',
    accept: () => cancelar()
  })
}

const exportarJson = () => {
  if (store.projeto.conteudo?.length) {
    const conteudo = store.projeto.conteudo

    const json = JSON.stringify(conteudo, null, 2)

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const nomeArquivo = store.projeto.nomeArquivo?.split('.')[0].trim()
   
    const a = document.createElement('a')
    a.href = url
    a.download = `${nomeArquivo}.json`

    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
