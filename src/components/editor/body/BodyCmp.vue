<template>
  <Splitter class="splitter_base">
    <SplitterPanel class="flex w-full h-full relative" :size="25" :minSize="30">
      <div class="splitter_card_itens">
        <div class="w-full" v-for="(item, index) in store.projeto.conteudo" :key="index">
          <CardItemCmp
            v-if="isParagrafo(item)"
            :titulo="(item as IParagrafo).descricao"
            :subtitulo="(item as IParagrafo).texto"
            :tipo="item.tipoConteudo"
          />
        </div>
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
  return item && (item as IParagrafo).nivel === 0
}
</script>

<style scoped lang="scss">
@import './style/style.scss';
</style>
