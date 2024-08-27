<template>
  <div
    class="card_item_notacao"
    :style="{
      borderLeftColor: `var(${borderColor})`,
      width: '100%'
    }"
  >
    <div class="col-1 align-items-center">
      <span class="pi pi-bars" style="cursor: grab"></span>
    </div>

    <div class="col-9 align-items-center">
      <NotacaoParagrafoCmp :paragrafo="props.conteudo as IParagrafo" />
    </div>

    <div class="col-2 align-items-center">
      <div class="card_footer">
        <Tag
          class="max-w-5rem"
          rounded
          style="height: 20px; color: var(--surface-500); background-color: var(--bg-default)"
          :value="props.conteudo?.tipoConteudo"
        />
        <div class="flex justify-content-center align-items-center">
          <Button
            text
            rounded
            severity="secondary"
            icon="pi pi-pen-to-square"
            pt:root:style="height: 30px; width: 30px"
            pt:icon:style="fontSize: 12px"
            v-show="isShowBtnEditar"
            :disabled="!!store.lockDebounceNotacaoParagrafo"
            @click="handleEditar"
          />
          <Button
            text
            rounded
            icon="pi pi-clone"
            severity="secondary"
            pt:root:style="height: 30px; width: 30px"
            pt:icon:style="fontSize: 12px"
            :disabled="!!store.lockDebounceNotacaoParagrafo"
            @click="handleDuplicar"
          />
          <Button
            text
            rounded
            icon="pi pi-trash"
            severity="secondary"
            pt:root:style="height: 30px; width: 30px"
            pt:icon:style="fontSize: 12px"
            :disabled="!!store.lockDebounceNotacaoParagrafo"
            @click="handleRemover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICardNotacao } from '@/components/editor/body/interfaces/ICard'
import type { IParagrafo } from '@/model/IBlueprint'
import { computed } from 'vue'
import NotacaoParagrafoCmp from '../notacao/components/NotacaoParagrafoCmp.vue'
import { CardItemTagColor } from './CardItemTagColor'
import { useStoreBase } from '@/stores/storeBase'

interface IEmit {
  (nome: 'editar'): void
  (nome: 'duplicar'): void
  (nome: 'remover', item?: string): void
}

const props = withDefaults(defineProps<ICardNotacao>(), { tipo: 'default' })
const emit = defineEmits<IEmit>()
const store = useStoreBase()

const borderColor = computed(() => CardItemTagColor[props.conteudo?.tipoConteudo || 'default'])

const isShowBtnEditar = computed(() => {
  return props.conteudo?.tipoConteudo === 'tabela'
})

const handleEditar = () => emit('editar')
const handleDuplicar = () => emit('duplicar')

const handleRemover = () => {
  emit('remover', props.conteudo?.id)
}
</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

.card_item_notacao {
  @include styleclass(
    'bg-white grid p-2 border-left-solid border-left-3 align-items-center shadow-1 border-round text-sm'
  );
}

.card_footer {
  @include styleclass('flex flex-column gap-2 h-full w-full justify-content-end align-items-end');
}
</style>
