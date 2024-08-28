<template>
  <div class="flex flex-column">
    <QuillEditor
      id="conteudo"
      theme="snow"
      contentType="html"
      v-model:content="conteudoHtml"
      :toolbar="appUtils.inputQuillToolbarOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { appConstants } from '@/constants/appConstants'
import type { IParagrafo } from '@/model/IBlueprint'
import { paragrafoParser } from '@/parser/paragrafoParser'
import { useStoreBase } from '@/stores/storeBase'
import { appUtils } from '@/utils/appUtils'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { debounce } from 'lodash'
import { onMounted, ref, watch } from 'vue'

interface IProps {
  paragrafo: IParagrafo
}

const props = defineProps<IProps>()
const store = useStoreBase()
const conteudoHtml = ref('')

const setConteudoHtml = (valor: string) => (conteudoHtml.value = valor)

const setParagrafo = () => {
  paragrafoParser.fromHtml(props.paragrafo, conteudoHtml.value)
  store.notacaoItens
    .filter((n) => n.id === props.paragrafo.id)
    .forEach((n) => {
      if (props.paragrafo.componentes) {
        n.componentes?.splice(0, n.componentes.length, ...props.paragrafo.componentes)
      }
    })
}

const debounceSetParagrafo = debounce(() => {
  setParagrafo()
  store.setLockDebounceNotacaoParagrafo(false)
}, appConstants.TEMPO_ESPERA_DEBOUNCE)

watch(conteudoHtml, () => {
  store.setLockDebounceNotacaoParagrafo(true)
  debounceSetParagrafo.cancel()
  debounceSetParagrafo()
})

watch(
  () => props.paragrafo,
  (valor) => {
    const paragrafo = paragrafoParser.toHtml(valor)
    setConteudoHtml(paragrafo)
  }
)

onMounted(() => {
  if (props.paragrafo) {
    const paragrafo = paragrafoParser.toHtml(props.paragrafo)
    
    setConteudoHtml(paragrafo)
  }
})
</script>
