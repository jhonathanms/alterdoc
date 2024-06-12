<template>
  <Splitter class="splitter_base">
    <SplitterPanel class="flex w-full h-full relative" :size="25" :minSize="30">
      <div class="splitter_componentes_itens">
        <CardItemCmp />
        <CardItemCmp />
        <CardItemCmp />
        <CardItemCmp />
        <CardItemCmp />
        <CardItemCmp />
        <CardItemCmp />
        <CardItemCmp />
      </div>

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
          :closeButtonProps="{class:'surface-300 h-1rem w-2rem border-0'}"
        >
          <template #display>
            <i class="pi pi-search" />
          </template>
          <template #content >
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
    </SplitterPanel>
    <SplitterPanel class="flex justify-content-center" :size="75" :minSize="50">
      <div class="w-full">
        <iframe
          :src="'https://documentacao-shop.alterdata.com.br/delivery-docs.html'"
          class="w-full h-full"
        ></iframe>
      </div>
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import CardItemCmp from '@/components/body/CardItemCmp.vue';
import { ref } from 'vue';

const showBtnAdd = ref(true)
function setShowBtnAdd() {
  showBtnAdd.value = !showBtnAdd.value
}
</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

$height_default: calc(100vh - 65px);

.splitter_base {
  height: $height_default;
  @include styleclass('w-full p-0');
}

.splitter_componentes_itens {
  height: calc(100vh - 150px);
  @include styleclass('flex flex-column align-items-center gap-3 w-full p-3 overflow-y-auto');
}

iframe {
  border: none;
}
</style>
