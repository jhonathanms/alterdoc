<template>
  <Dialog
    modal
    maximizable
    :visible="store.modal.abrir"
    :draggable="false"
    :header="store.modal.cabecalho"
    :style="{ minWidth: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :pt:header:style="{ background: `var(--surface-100` }"
    @update:visible="handleFechar"
    @maximize="handleMaximize"
    @unmaximize="handleUnMaximize"
  >
    <slot></slot>
    <template #footer>
      <div class="footer_container_acoes">
        <div class="flex align-items-center" v-if="!store.modal.isEdicao">
          <Checkbox
            inputId="continuar-adicionando"
            :binary="true"
            :modelValue="store.modal.continuarAdicionando"
            @update:modelValue="handleContinuarAdicionando"
          />
          <label for="continuar-adicionando" class="ml-2">Continuar adicionando</label>
        </div>
        <div class="footer_container_acoes_botoes">
          <Button label="Cancelar" text severity="secondary" @click="handleFechar" />
          <Button label="Gravar" autofocus @click="handleGravar" w-12 />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase'
import Checkbox from 'primevue/checkbox'

interface IEmit {
  (nome: 'gravar'): void
}

const emit = defineEmits<IEmit>()
const store = useStoreBase()

const handleGravar = () => emit('gravar')
const handleFechar = () => store.setModal({ abrir: false })
const handleMaximize = () => store.setModalMaximize()
const handleUnMaximize = () => store.setModalUnMaximize()
const handleContinuarAdicionando = (value: boolean) => {
  store.setModalContinuarAdicionando(value)
}
</script>

<style lang="scss" scoped>
@import 'primeflex/primeflex.scss';

.footer_container_acoes {
  @include styleclass('w-full flex gap-2 justify-content-between align-items-center');
}

.footer_container_acoes_botoes {
  @include styleclass('w-full flex gap-2 justify-content-end');
}
</style>
