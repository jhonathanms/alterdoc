<template>
  <Card class="card_item" :style="{ borderLeftColor: `var(${borderColor})` }" :pt="cardPT">
    <template #title>{{ props.titulo }}</template>
    <template #subtitle>{{ props.subtitulo }}</template>
    <template #footer>
      <div class="card_footer">
        <Tag
          class="w-5 max-w-5rem"
          rounded
          style="height: 20px; color: var(--surface-500); background-color: var(--bg-default)"
          :value="props.tipo"
        />
        <div class="flex justify-content-center">
          <Button
            text
            rounded
            severity="secondary"
            icon="pi pi-pen-to-square"
            pt:root:style="height: 30px; width: 30px"
            pt:icon:style="fontSize: 12px"
            @click="handleEditar"
          />
          <Button
            text
            rounded
            icon="pi pi-clone"
            severity="secondary"
            pt:root:style="height: 30px; width: 30px"
            pt:icon:style="fontSize: 12px"
          />
          <Button
            text
            rounded
            icon="pi pi-times"
            severity="secondary"
            pt:root:style="height: 30px; width: 30px"
            pt:icon:style="fontSize: 12px"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { ICard } from '@/components/editor/body/interfaces/ICard'
import { computed } from 'vue'
import { CardItemTagColor } from './CardItemTagColor'

interface IEmit {
  (nome: 'editar'): void
}

const props = withDefaults(defineProps<ICard>(), { tipo: 'default' })
const emit = defineEmits<IEmit>()

const borderColor = computed(() => CardItemTagColor[props.tipo])

const handleEditar = () => emit('editar')

const cardPT = {
  title: {
    class: 'p-0 text-base w-full overflow-hidden text-overflow-ellipsis'
  },
  subtitle: {
    class: 'flex p-0 white-space-nowrap overflow-hidden text-overflow-ellipsis',
    style: 'max-width: 200px; min-width: 50px;'
  },
  body: {
    class: 'pl-3 pr-2 py-2'
  },
  content: {
    class: 'hidden p-0'
  },
  footer: {
    class: 'p-0 pt-1'
  }
}
</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

.card_item {
  @include styleclass('text-sm w-full h-full border-left-solid border-left-3');
}

.card_footer {
  @include styleclass('card flex gap-2 h-full justify-content-between align-items-center');
}
</style>
