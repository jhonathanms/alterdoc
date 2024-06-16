<template>
  <div class="w-full">
    <iframe :src="url" class="w-full h-full"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const url = ref<string>('https://documentacao-shop.alterdata.com.br/delivery-docs.html')
</script>

<style scoped lang="scss"></style>
