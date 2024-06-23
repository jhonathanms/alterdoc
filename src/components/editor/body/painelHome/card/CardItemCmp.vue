<template>
  <Card
    class="card_item"
    :style="{ borderLeftColor: `var(${getBorderColor})` }"
    :pt="{
      title: {
        class: 'p-0 text-base w-full overflow-hidden text-overflow-ellipsis'
      },
      subtitle: {
        class: 'flex p-0 white-space-nowrap overflow-hidden text-overflow-ellipsis',
        style: 'max-width: 200px; min-width: 50px;',
      },
      body: {
        class: 'p-3 h-full'
      },
      content: {
        class: 'hidden p-0'
      },
      footer: {
        class: 'p-0 pt-1'
      }
    }"
  >
    <template #title>{{ data.titulo }}</template>

    <template #subtitle>{{ data.subtitulo }}</template>

    <template #footer>
      <div class="card_footer">
        <Tag
          :value="data.tipo"
          rounded
          class="w-3"
          style="height: 20px; color: var(--surface-500); background-color: var(--bg-default)"
        />
        <div class="flex gap-2 justify-content-center">
          <Button
            rounded
            outlined
            severity="secondary"
            icon="pi pi-pen-to-square"
            pt:root:class="h-2rem w-2rem"
          />
          <Button
            icon="pi pi-clone"
            rounded
            outlined
            severity="secondary"
            pt:root:class="h-2rem w-2rem "
          />
          <Button
            rounded
            outlined
            icon="pi pi-times"
            severity="secondary"
            pt:root:class="h-2rem w-2rem"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { ICard } from '@/components/editor/body/interfaces/ICard';
import { computed } from 'vue';
import { CardItemTagColor } from './CardItemTagColor';

const data = withDefaults(defineProps<ICard>(), { tipo: 'default' })
const getBorderColor = computed(() => CardItemTagColor[data.tipo])
</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

.card_item {
  @include styleclass('text-sm w-full h-7rem border-left-solid border-left-3');
}

.card_footer {
  @include styleclass('card flex gap-2 h-2rem justify-content-between align-items-cente');
}
</style>
