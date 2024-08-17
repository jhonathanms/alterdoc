<template>
  <Dialog
    modal
    maximizable
    :visible="props.visible"
    :draggable="false"
    :header="props.header"
    :style="{ minWidth: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @update:visible="handleFechar"
    @maximize="handleMaximize"
    @unmaximize="handleUnMaximize"
  >
    <slot></slot>
    <template #footer>
      <div class="footer_container_acoes">
        <div class="flex align-items-center" v-if="!isEdicao">
          <Checkbox
            inputId="continuar-adicionando"
            :modelValue="props.continuarAdicionando"
            :binary="true"
            @update:modelValue="handleContinuarAdicionando"
          />
          <label for="continuar-adicionando" class="ml-2">Continuar adicionando</label>
        </div>
        <div class="footer_container_acoes_botoes">
          <Button label="Cancelar" text severity="secondary" @click="handleCancelar" />
          <Button label="Gravar" autofocus @click="handleGravar" w-12 />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Checkbox from 'primevue/checkbox'

type Props = {
  visible: boolean
  header: string
  isEdicao: boolean
  continuarAdicionando: boolean
}

interface IEmit {
  (nome: 'fechar'): void
  (nome: 'gravar'): void
  (nome: 'cancelar'): void
  (nome: 'continuarAdicionando', value: any): void
  (nome: 'maximize'): void
  (nome: 'unMaximize'): void
}

const props = defineProps<Props>()
const emit = defineEmits<IEmit>()

const handleFechar = () => emit('fechar')
const handleGravar = () => emit('gravar')
const handleCancelar = () => emit('cancelar')
const handleMaximize = () => emit('maximize')
const handleUnMaximize = () => emit('unMaximize')

const handleContinuarAdicionando = (value: any) => {
  emit('continuarAdicionando', value)
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
