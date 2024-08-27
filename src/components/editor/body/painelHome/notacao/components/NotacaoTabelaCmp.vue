<template>
  <div class="flex gap-2 flex-column">
    <div class="flex gap-2">
      <Button
        label="Coluna"
        icon="pi pi-plus"
        severity="success"
        pt:root:style="height: 30px; font-size: 0.8rem; padding: 5px"
        pt:icon:style="fontSize: 12px"
        @click="addColuna"
      />
      <Button
        label="Linha"
        icon="pi pi-plus"
        severity="success"
        pt:root:style="height: 30px; font-size: 0.8rem; padding: 5px"
        pt:icon:style="fontSize: 12px"
        @click="addLinha"
      />
      <Divider layout="vertical" />
      <Button
        outlined
        label="Coluna"
        icon="pi pi-minus"
        severity="secondary"
        pt:root:style="height: 30px; font-size: 0.8rem; padding: 5px;"
        pt:icon:style="fontSize: 12px"
        @click="removerColuna()"
      />
      <Button
        outlined
        label="Linhda"
        icon="pi pi-minus"
        severity="secondary"
        pt:root:style="height: 30px; font-size: 0.8rem; padding: 5px;"
        pt:icon:style="fontSize: 12px"
        @click="removerLinha"
      />
    </div>
    <DataTable
      :value="TabelaDados"
      showGridlines
      scrollable
      scrollHeight="250px"
      tableStyle="width: 0px"
    >
      <Column
        headerClass="w-full font-bold py-1 px-3 bg-blue-100"
        bodyClass="w-full py-1 px-3 text-200"
        :key="colIndex"
        :field="col.field"
        v-for="(col, colIndex) in colunas"
      >
        <template #header>
          <div
            class="flex gap-2 justify-content-between align-items-center"
            @mouseover="setShowBtnRemoverCol(col.field, true)"
            @mouseleave="setShowBtnRemoverCol(col.field, false)"
          >
            <InputText
              class="font-bold"
              placeholder="Nome da Coluna"
              size="small"
              v-model="col.header"
            />
            <Transition name="fade">
              <Button
                text
                rounded
                icon="pi pi-trash"
                severity="secondary"
                pt:root:style="height: 30px; width: 30px"
                pt:icon:style="fontSize: 12px"
                v-if="col.isShowBtnRemove"
                @click="removerColuna(col.field)"
              />
            </Transition>
          </div>
        </template>
        <template #body="slotProps">
          <InputText class="w-full" v-model="slotProps.data[col.field]" size="small" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import { ref } from 'vue'

interface TabelaColuna {
  field: string
  header: string
  isShowBtnRemove: boolean
}

interface TabelaLinha {
  [key: string]: string
}

const setShowBtnRemoverCol = (field: string, valor: boolean) => {
  colunas.value.filter((c) => c.field === field).forEach((c) => (c.isShowBtnRemove = valor))
}

const colunas = ref<TabelaColuna[]>([
  { field: 'col1', header: 'Col 1 teste', isShowBtnRemove: false },
  { field: 'col2', header: 'Col 2', isShowBtnRemove: false }
])

const TabelaDados = ref<TabelaLinha[]>([{ col1: '', col2: '' }])

const addColuna = () => {
  const novoCampo = `col${colunas.value.length + 1}`

  colunas.value.push({
    field: novoCampo,
    header: `Col ${colunas.value.length + 1}`,
    isShowBtnRemove: false
  })

  TabelaDados.value.forEach((linha) => {
    linha[novoCampo] = ''
  })
}

const removerColuna = (field?: string) => {
  if (colunas.value.length <= 1) return

  if (field) {
    const indice = colunas.value.findIndex((c) => c.field === field)
    const colunasRemovidas = colunas.value.splice(indice, 1)

    if (colunasRemovidas.length > 0) {
      TabelaDados.value.forEach((linha) => {
        delete linha[field]
      })
    }
  } else {
    const colunaRemovida = colunas.value.pop()
    if (colunaRemovida) {
      TabelaDados.value.forEach((linha) => {
        delete linha[colunaRemovida.field]
      })
    }
  }
}

const addLinha = () => {
  const novaLinha: TabelaLinha = {}
  colunas.value.forEach((col) => {
    novaLinha[col.field] = ''
  })
  TabelaDados.value.push(novaLinha)
}

const removerLinha = () => {
  if (TabelaDados.value.length <= 1) return
  TabelaDados.value.pop()
}
</script>

<style scoped></style>
