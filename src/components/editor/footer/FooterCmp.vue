<template>
  <div class="surface-600 align-items-center justify-content-between text-sm">
    <span class="text-0">© 1989-{{ getAno }} - Alterdata Software - Direitos Reservados </span>

    <div class="card flex justify-content-end gap-2 h-2rem w-3">
      <SelectButton
        v-model="store.togglePreview"
        pt:button:class="p-2 h-2rem text-xs"
        :allowEmpty="false"
        :options="['Codigo', 'Html']"
      />

      <Button icon="pi pi-align-left" severity="secondary" class="btn_foot" />
      <Button icon="pi pi-external-link" severity="secondary" class="btn_foot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase'
import SelectButton from 'primevue/selectbutton'
import { computed } from 'vue'

const store = useStoreBase()

const getAno = computed(() => new Date().getFullYear())
</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

.btn_foot {
  @include styleclass('w-1');
}
</style>
