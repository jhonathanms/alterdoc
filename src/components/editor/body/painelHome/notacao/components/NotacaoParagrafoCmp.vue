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
  const paragrafoLocal: IParagrafo = { ...props.paragrafo }

  paragrafoParser.fromHtml(paragrafoLocal, conteudoHtml.value)
  store.notacaoItens
    .filter((n) => n.id === paragrafoLocal.id)
    .forEach((n) => {
      if (paragrafoLocal.componentes) {
        const notacaoParagrafo = n as IParagrafo
        Object.assign(notacaoParagrafo, paragrafoLocal)
      }
    })
}

function carregarParagrafo(paragrafo?: IParagrafo) {
  let paragrafoLocal = {} as IParagrafo
  if (paragrafo) {
    paragrafoLocal = { ...paragrafo }
  } else {
    paragrafoLocal = { ...props.paragrafo }
  }

  const html = paragrafoParser.toHtml(paragrafoLocal)
  setConteudoHtml(html)
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
  (novoParagrafo) => {
    carregarParagrafo(novoParagrafo)
  }
)

onMounted(() => {
  if (props.paragrafo) {
    carregarParagrafo()
  }
})
</script>
