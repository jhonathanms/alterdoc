<template>
  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
        <span class="font-bold text-l block mb-2 mt-4">{{ message.header }}</span>
        <p class="mb-0" v-show="message.message">{{ message.message }}</p>
        <div class="flex align-items-center gap-2 mt-4">
          <Button ref="confirmButton" label="Sim" @click="acceptCallback"></Button>
          <Button label="Não" outlined @click="rejectCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import { onMounted, ref } from 'vue';

const confirmButton = ref<HTMLButtonElement | null>(null);

onMounted(() => {
  confirmButton.value?.focus();
})
</script>
