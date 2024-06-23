<template>
  <div
    class="absolute flex gap-2 bottom-0 w-full h-5rem p-3 align-items-center"
    style="box-shadow: 10px 10px 15px #000000"
  >
    <Button
      type="button"
      class="w-full"
      v-show="showBtnAdd"
      label="Adicionar"
      severity="primary"
      badge="CTRL + N"
      :pt="{
        badge: {
          class: 'absolute top-0 right-0',
          style: { background: '#FFFFFF00', color: '#FFFFFF', fontSize: '9px' }
        }
      }"
    />

    <Inplace
      @open="setShowBtnAdd"
      @close="setShowBtnAdd()"
      :closable="true"
      :closeButtonProps="{ class: 'surface-300 h-2rem w-2rem border-0' }"
      pt:content:class="flex gap-2"
    >
      <template #display>
        <i class="pi pi-search" />
      </template>

      <template #content>
        <InputGroup class="h-2rem">
          <InputText />
          <Button
            class="bg-gray-300 border-1"
            icon="pi pi-search"
            style="border-color: var(--bg-border-btn)"
          />
        </InputGroup>
      </template>
    </Inplace>
  </div>
</template>

<script setup lang="ts">
import { useStoreBase } from '@/stores/storeBase';
import { ref } from 'vue'

const showBtnAdd = ref(true)

const store = useStoreBase()

const setShowBtnAdd = () => {
  showBtnAdd.value = !showBtnAdd.value
}

const handlePesquisa = () => {
  const conteudo = store.projeto.conteudo
  
}
</script>
