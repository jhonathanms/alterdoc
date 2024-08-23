<template>
  <Splitter class="splitter_base">
    <SplitterPanel class="flex w-full h-full relative" :size="25" :minSize="30">
      <div class="splitter_card_itens">
        <template v-for="(item, index) in store.projeto.conteudo" :key="index">
          <CardItemCmp
            v-if="isParagrafo(item)"
            :titulo="obterIdentificacaoDoConteudo(item).titulo"
            :subtitulo="obterIdentificacaoDoConteudo(item).subTitulo"
            :tipo="item.tipoConteudo"
            @editar="abrirModalEdicao(item)"
          />
        </template>
        <div class="flex align-items-center h-full" v-if="!store.projeto.conteudo?.length">
          <p class="text-300 text-center">Adicione novos elementos na documentação.</p>
        </div>
      </div>

      <AcoesCmp />

      <ModalBase
        :visible="modal.abrir"
        :header="modal.cabecalho"
        :isEdicao="modal.isEdicao"
        :continuarAdicionando="continuarAdicionando"
        @maximize="setMaximize"
        @unmaximize="setUnMaximize"
        @fechar="fecharModal"
        @cancelar="cancelarModal"
        @gravar="gravarModal"
        @continuarAdicionando="setContinuarAdicionando"
      >
        <ParagrafoCmp
          :paragrafo="modal.conteudo"
          :maximize="maximize"
          v-if="modal.tipo === 'paragrafo'"
        />
      </ModalBase>
    </SplitterPanel>

    <SplitterPanel class="flex justify-content-center" :size="75" :minSize="50">
      <PreviewHtmlCmp v-if="store.togglePreview === 'Html'" />
      <PreviewCodigoCmp v-else />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import type { IConteudo, IParagrafo } from '@/model/IBlueprint'
import type { IModalBase } from '@/model/IProjeto'
import { useStoreBase } from '@/stores/storeBase'
import { reactive, ref } from 'vue'
import AcoesCmp from './painelHome/acoes/AcoesCmp.vue'
import CardItemCmp from './painelHome/card/CardItemCmp.vue'
import ModalBase from './painelHome/modal/ModalBase.vue'
import ParagrafoCmp from './painelHome/paragrafo/ParagrafoCmp.vue'
import PreviewCodigoCmp from './painelPreview/PreviewCodigoCmp.vue'
import PreviewHtmlCmp from './painelPreview/PreviewHtmlCmp.vue'

const modal = reactive<IModalBase>({
  cabecalho: '',
  tipo: 'default',
  conteudo: {},
  abrir: false,
  isEdicao: false
} as IModalBase)

const setModal = (props: IModalBase) => {
  modal.cabecalho = props.cabecalho
  modal.tipo = props.tipo
  modal.conteudo = props.conteudo
  modal.abrir = props.abrir
  modal.isEdicao = props.isEdicao
}

const maximize = ref(false)
const continuarAdicionando = ref(false)

const setMaximize = () => {
  maximize.value = true
}

const setUnMaximize = () => {
  maximize.value = false
}

const setContinuarAdicionando = (value: boolean) => {
  continuarAdicionando.value = value
}

const store = useStoreBase()

const isParagrafo = (item: IConteudo) => {
  return item && item.tipoConteudo !== 'configuracao' && (item as IParagrafo).nivel !== 0
}

const obterIdentificacaoDoConteudo = (item: IConteudo): { titulo: string; subTitulo: string } => {
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

const abrirModalEdicao = (conteudo: IConteudo) => {
  setModal({
    cabecalho: obterIdentificacaoDoConteudo(conteudo).titulo,
    tipo: conteudo.tipoConteudo,
    conteudo: conteudo,
    abrir: true,
    isEdicao: true
  })
}

const fecharModal = () => setModal({ ...modal, abrir: false })

const cancelarModal = () => setModal({ ...modal, abrir: false })

const gravarModal = () => { 
  setModal({ ...modal, abrir: false })
}

</script>

<style scoped lang="scss">
@import './style/style.scss';
</style>
