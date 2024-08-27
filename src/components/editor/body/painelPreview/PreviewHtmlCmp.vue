<template>
  <div class="w-full">
    <iframe
      :src="url"
      class="w-full h-full"
      ref="iframeRef"
      @focusin="onIframeFocus"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const iframeRef = ref<HTMLIFrameElement | null>(null);
const url = ref<string>('https://documentacao-shop.alterdata.com.br/delivery-docs.html')

function onIframeFocus() {
  iframeRef.value?.blur();
  iframeRef.value?.parentElement?.focus();
}

</script>

<style scoped lang="scss">
iframe:focus {
  outline: none;
}
</style>
