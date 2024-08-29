<template>
  <div
    class="card_item_notacao"
    :style="{
      borderLeftColor: `var(${borderColor})`,
      width: '100%'
    }"
  >
    <div class="col-1 align-items-center hidden">
      <span class="pi pi-bars" style="cursor: grab"></span>
    </div>

    <div class="col-12 align-items-center">
      <div class="card_acoes">
        <Tag
          class="max-w-7rem"
          rounded
          style="color: var(--surface-500); background-color: var(--bg-default)"
          :value="props.conteudo?.tipoConteudo"
        />
        <div class="flex justify-content-center align-items-center">
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

    <div class="col-12 align-items-center">
      <NotacaoParagrafoCmp
        v-if="props.conteudo?.tipoConteudo === 'paragrafo'"
        :paragrafo="props.conteudo as IParagrafo"
      />
      <NotacaoTabelaCmp
        v-if="props.conteudo?.tipoConteudo === 'tabela'"
        :tabela="props.conteudo as ITabela"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICardNotacao } from '@/components/editor/body/interfaces/ICard'
import type { IParagrafo, ITabela } from '@/model/IBlueprint'
import { useStoreBase } from '@/stores/storeBase'
import { computed } from 'vue'
import NotacaoParagrafoCmp from '../notacao/components/NotacaoParagrafoCmp.vue'
import NotacaoTabelaCmp from '../notacao/components/NotacaoTabelaCmp.vue'
import { BorderLeftColor } from './BorderLeftColor'

interface IEmit {
  (nome: 'duplicar'): void
  (nome: 'remover', item?: string): void
}

const props = withDefaults(defineProps<ICardNotacao>(), { tipo: 'default' })
const emit = defineEmits<IEmit>()
const store = useStoreBase()

const borderColor = computed(() => BorderLeftColor[props.conteudo?.tipoConteudo || 'default'])

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

.card_acoes {
  @include styleclass('flex gap-2 h-full w-full justify-content-between align-items-end');
}
</style>
