<template>
  <DataTable :value="['products']" tableStyle="min-width: 10em">
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
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
