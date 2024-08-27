<template>
  <div class="flex flex-column gap-3 mt-2">
    <div class="flex flex-column gap-2">
      <label for="titulo">Titulo</label>
      <InputText id="titulo" size="small" :value="props.paragrafo?.titulo" @input="handleTitulo" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="conteudo">Conteúdo</label>
      <QuillEditor
        id="conteudo"
        theme="snow"
        contentType="html"
        v-model:content="conteudoHtml"
        :style="!store.modal.maximize && { width: '1000px', height: '300px' }"
        :toolbar="appUtils.inputQuillToolbarOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { appConstants } from '@/constants/appConstants'
import type { IParagrafo } from '@/model/IBlueprint'
import { useStoreBase } from '@/stores/storeBase'
import { appUtils } from '@/utils/appUtils'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { debounce } from 'lodash'
import { onMounted, ref, watch } from 'vue'
import { paragrafoParser } from '../../../../../parser/paragrafoParser'

interface IProps {
  paragrafo: IParagrafo
  isAtualizarTituloModal?: boolean
}

const props = withDefaults(defineProps<IProps>(), { isAtualizarTituloModal: true })
const store = useStoreBase()
const conteudoHtml = ref('')

const setConteudoHtml = (valor: string) => (conteudoHtml.value = valor)

const setDescricao = () => {
  paragrafoParser.fromHtml(props.paragrafo, conteudoHtml.value)
  store.projeto.conteudo
    ?.filter((c) => c.id === props.paragrafo.id)
    .forEach((c) => {
      if (props.paragrafo.componentes) {
        c.componentes?.splice(0, c.componentes.length, ...props.paragrafo.componentes)
      }
    })
}

const handleTitulo = (e: Event) => {
  const valor = (e.target as HTMLInputElement).value
  store.projeto.conteudo
    ?.filter((c) => c.id === props.paragrafo.id)
    .forEach((c) => {
      ;(c as IParagrafo).titulo = valor
    })

  if (props.isAtualizarTituloModal) store.setModal({ ...store.modal, cabecalho: valor })
}

const debounceSetDescricao = debounce(() => {
  setDescricao()
}, appConstants.TEMPO_ESPERA_DEBOUNCE)

watch(conteudoHtml, () => {
  debounceSetDescricao.cancel()
  debounceSetDescricao()
})

onMounted(() => {
  if (props.paragrafo) {
    const paragrafo = paragrafoParser.toHtml(props.paragrafo)
    setConteudoHtml(paragrafo)
  }
})
</script>
