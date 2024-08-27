<template>
  <div class="flex flex-column gap-3 mt-2">
    <div class="flex flex-column gap-2">
      <label for="titulo">Titulo</label>
      <InputText id="titulo" size="small" :value="titulo" @input="handleTitulo" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="conteudo">Conteúdo</label>
      <div>
        <Menubar :model="menuItems" />
        <div
          class="surface-100 flex flex-column align-items-center gap-3 my-1 p-5 overflow-y-auto overflow-x-hidden border-round"
          :style="{
            height: !store.modal.maximize ? '250px' : '100%',
            width: !store.modal.maximize ? '1000px' : '100%'
          }"
        >
          <template v-for="(item) in store.notacaoItens" :key="item?.conteudo?.id">
            <CardItemNotacaoCmp
              :conteudo="item"
              @editar="handleEditar"
              @duplicar="handleDuplicar"
              @remover="handleRemover"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { INota, IParagrafo } from '@/model/IBlueprint';
import { useStoreBase } from '@/stores/storeBase';
import { appUtils } from '@/utils/appUtils';
import { computed, reactive } from 'vue';

interface IProps {
  notacao: INota
}

interface IPropsMenuItem {
  label: string
  icon: string
  command?: () => void
}

const props = defineProps<IProps>()
const store = useStoreBase()

const menuItems = reactive<IPropsMenuItem[]>([
  {
    label: 'Paragrafo',
    icon: 'pi pi-align-justify',
    command: () => {
      handleAddParagrafo()
    }
  },
  { label: 'Tabela', icon: 'pi pi-table' },
  { label: 'Código', icon: 'pi pi-code' }
])

const titulo = computed(() => {
  return (props.notacao?.componentes?.[0] as IParagrafo).titulo || ''
})

const handleTitulo = (e: Event) => {
  const valor = (e.target as HTMLInputElement).value
  store.projeto.conteudo
    ?.filter((c) => c.id === props.notacao.id)
    .forEach((c) => {
      ;(c as INota).titulo = valor
    })
  store.setModal({ ...store.modal, cabecalho: valor })
}

const handleEditar = () => {}
const handleDuplicar = () => {}
const handleRemover = (id: string) => {
  const indice = store.notacaoItens.findIndex((nota) => nota.id === id)
  store.notacaoItens.splice(indice, 1)
}

const handleAddParagrafo = () => {
  store.notacaoItens.push({
    id: appUtils.gerarId(),
    tipoConteudo: 'paragrafo',
    texto: ''
  } as IParagrafo)
}
</script>
