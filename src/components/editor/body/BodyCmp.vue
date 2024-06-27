<template>
  <Splitter class="splitter_base">
    <SplitterPanel class="flex w-full h-full relative" :size="25" :minSize="30">
      <div class="splitter_card_itens">
        <template v-for="(item, index) in store.projeto.conteudo" :key="index">
          <!-- Criar um construtor de cards com base no tipo. -->
          <CardItemCmp
            :titulo="getDados(item).titulo"
            :subtitulo="getDados(item).subTitulo"
            :tipo="item.tipoConteudo"
            v-if="isParagrafo(item)"
          />
        </template>
      </div>

      <AcoesCmp />
    </SplitterPanel>

    <SplitterPanel class="flex justify-content-center" :size="75" :minSize="50">
      <PreviewHtmlCmp v-if="store.togglePreview === 'Html'" />
      <PreviewCodigoCmp v-else />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import type { IConteudo, IParagrafo } from '@/model/IBlueprint'
import { useStoreBase } from '@/stores/storeBase'
import AcoesCmp from './painelHome/acoes/AcoesCmp.vue'
import CardItemCmp from './painelHome/card/CardItemCmp.vue'
import PreviewCodigoCmp from './painelPreview/PreviewCodigoCmp.vue'
import PreviewHtmlCmp from './painelPreview/PreviewHtmlCmp.vue'

const store = useStoreBase()

const isParagrafo = (item: IConteudo) => {
  return item && item.tipoConteudo !== 'configuracao' && (item as IParagrafo).nivel !== 0
}

const getDados = (item: IConteudo): { titulo: string; subTitulo: string } => {
  switch (item.tipoConteudo) {
    case 'paragrafo':
    case 'grupo': {
      const titulo = (item as IParagrafo).titulo || ''
      const subTitulo = (item as IParagrafo).texto || ''
      return { titulo, subTitulo }
    }

    case 'alerta':
    case 'notacao': {
      if (item.componentes?.length) {
        const paragrafo: IParagrafo = item?.componentes[0] as IParagrafo
        const titulo = paragrafo.titulo || ''
        const subTitulo = paragrafo.texto || ''
        return { titulo, subTitulo }
      }
      return { titulo: '', subTitulo: '' }
    }

    default:
      return { titulo: '', subTitulo: '' }
  }
}
</script>

<style scoped lang="scss">
@import './style/style.scss';
</style>
