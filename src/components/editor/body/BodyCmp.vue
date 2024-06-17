<template>
  <Splitter class="splitter_base">
    <SplitterPanel class="flex w-full h-full relative" :size="25" :minSize="30">
      <div class="splitter_card_itens">
        <CardItemCmp :titulo="'Titulo da documentação'" :subtitulo="''" :tipo="'titulo'" />
        <CardItemCmp
          :titulo="'Bloco de texto'"
          :subtitulo="'A API de Delivery concentra os serviços de entrega (deliveries)'"
          :tipo="'texto'"
        />
        <CardItemCmp
          :titulo="'Bloco de código'"
          :subtitulo="'bearer 5262d64b892e8d4341000001'"
          :tipo="'codigo'"
        />
        <CardItemCmp :titulo="'Tabela'" :subtitulo="''" :tipo="'tabela'" />
        <CardItemCmp
          :titulo="'Citação'"
          :subtitulo="'“A quote from another time and place”'"
          :tipo="'citacao'"
        />
        <CardItemCmp :titulo="'Lista'" :subtitulo="''" :tipo="'lista'" />
        <CardItemCmp
          :titulo="'Avisos'"
          :subtitulo="'O provedor UBER_EATS foi descontinuado...'"
          :tipo="'alerta'"
        />
        <CardItemCmp :titulo="'Grupo/Sessão'" :subtitulo="''" :tipo="'grupo'" />
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
import { useStoreBase } from '@/stores/storeBase'
import AcoesCmp from './painelHome/acoes/AcoesCmp.vue'
import CardItemCmp from './painelHome/card/CardItemCmp.vue'
import PreviewCodigoCmp from './painelPreview/PreviewCodigoCmp.vue'
import PreviewHtmlCmp from './painelPreview/PreviewHtmlCmp.vue'

const store = useStoreBase()
</script>

<style scoped lang="scss">
@import './style/style.scss';
</style>
