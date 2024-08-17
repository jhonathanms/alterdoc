<template>
  <div class="flex flex-column gap-1 mt-2">
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
        :style="!props.maximize && { width: '1000px', height: '300px' }"
        v-model:content="conteudoHtml"
        :toolbar="toolbarOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IParagrafo } from '@/model/IBlueprint'
import { useStoreBase } from '@/stores/storeBase'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { onMounted, ref, watch } from 'vue'
import { paragrafoParser } from '../../../../../parser/paragrafoParser'
import { debounce } from 'lodash'

interface IProps {
  paragrafo: IParagrafo
  maximize: boolean
}

const TEMPO_ESPERA_DEBOUNCE = 1500

const props = defineProps<IProps>()
const store = useStoreBase()
const conteudoHtml = ref('')

const toolbarOptions = [
  [{ header: [3, false] }],
  ['bold', 'italic'],
  ['link'],
  [{ list: 'ordered' }, { list: 'bullet' }]
]

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
    .forEach((c) => ((c as IParagrafo).titulo = valor))
}

const debounceSetDescricao = debounce(() => {
  setDescricao()
}, TEMPO_ESPERA_DEBOUNCE)

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

<style lang="scss" scoped></style>
