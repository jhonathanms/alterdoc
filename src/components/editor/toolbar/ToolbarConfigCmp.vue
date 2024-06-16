<template>
  <div class="flex flex-column gap-1 mt-3">
    <h3>Configurações</h3>
    <div class="flex flex-column gap-2">
      <label for="formato">Formato</label>
      <InputText id="formato" size="small" disabled modelValue="1A" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="username">Local</label>
      <InputText size="small" disabled modelValue="C:\AlterdataDSN\repositorios\projetoSpice\backend\spice-api\api\docs" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="username">Host</label>
      <InputText size="small" modelValue="http://127.0.0.1:8877/v1" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
