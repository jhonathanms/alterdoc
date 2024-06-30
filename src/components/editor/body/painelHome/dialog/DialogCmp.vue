<template>
  <Dialog
    :visible="store.abrirModalCadastro"
    @update:visible="() => store.setAbrirmodalCadastro(false)"
    maximizable
    :draggable="false"
    modal
    header="Header"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <DataTable :value="products" tableStyle="min-width: 10em">
      <Column field="code" header="Código">
        <template #body="slotProps">
          <InputText type="text" v-model="slotProps.data.code" />
        </template>
      </Column>
      <Column field="name" header="Nome">
        <template #body="slotProps">
          <InputText type="text" v-model="slotProps.data.name" />
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase';
import { onMounted, ref } from 'vue';

const products = ref<{ code: string; name: string }[]>()

const props = defineProps<{ id: string }>()

const store = useStoreBase()

onMounted(() => {
  products.value = [
    { code: '1', name: 't1' },
    { code: '2', name: 't2' }
  ]
})

</script>
