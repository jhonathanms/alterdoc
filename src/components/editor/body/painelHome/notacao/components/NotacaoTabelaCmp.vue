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
        @click="removerLinha()"
      />
    </div>
    <DataTable
      :value="tabelaDados"
      showGridlines
      scrollable
      scrollHeight="250px"
      tableStyle="width: 0px"
      class="custom-scroll"
    >
      <Column
        headerClass="w-full font-bold py-1 px-3 bg-blue-100"
        bodyClass="w-full py-1 px-3 text-200"
        :key="colIndex"
        :field="col.id"
        v-for="(col, colIndex) in colunas"
      >
        <template #header>
          <div
            class="flex gap-2 justify-content-between align-items-center"
            @mouseover="setShowBtnRemoverCol(col.id, true)"
            @mouseleave="setShowBtnRemoverCol(col.id, false)"
          >
            <InputText
              class="font-bold"
              placeholder="Nome da Coluna"
              size="small"
              v-model="col.nome"
            />
            <Transition name="fade">
              <Button
                text
                rounded
                icon="pi pi-trash"
                severity="secondary"
                pt:root:style="height: 30px; width: 30px"
                pt:icon:style="fontSize: 12px"
                v-show="col.isShowBtnRemove"
                @click="removerColuna(col.id)"
              />
            </Transition>
          </div>
        </template>
        <template #body="slotProps">
          <div
            class="flex gap-2 justify-content-between align-items-center"
            @mouseover="setShowBtnRemoverLinha(slotProps.index, true)"
            @mouseleave="setShowBtnRemoverLinha(slotProps.index, false)"
          >
            <InputText class="w-full" v-model="slotProps.data[col.id]" size="small" />
            <Transition name="fade">
              <Button
                text
                rounded
                icon="pi pi-trash"
                severity="secondary"
                pt:root:style="height: 30px; width: 30px"
                pt:icon:style="fontSize: 12px"
                v-show="slotProps.data['isShowBtnRemove'] === 'true'"
                @click="removerLinha(slotProps.index)"
              />
            </Transition>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { ITabela } from '@/model/IBlueprint'
import { useStoreBase } from '@/stores/storeBase'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import { onMounted, ref, watch } from 'vue'

interface TabelaColuna {
  id: string
  nome: string
  isShowBtnRemove: boolean
}

interface TabelaLinha {
  [key: string]: string
}

interface IProps {
  tabela: ITabela
}

const props = defineProps<IProps>()
const store = useStoreBase()

const colunas = ref<TabelaColuna[]>([])

const tabelaDados = ref<TabelaLinha[]>([])

const setShowBtnRemoverCol = (id: string, valor: boolean) => {
  colunas.value.filter((c) => c.id === id).forEach((c) => (c.isShowBtnRemove = valor))
}

const setShowBtnRemoverLinha = (indice: number, valor: boolean) => {
    tabelaDados.value.filter((l, i) => i === indice).forEach((l) => l['isShowBtnRemove'] = valor.toString())
}

const addColuna = () => {
  const novoCampo = `col${colunas.value.length + 1}`

  colunas.value.push({
    id: novoCampo,
    nome: '',
    isShowBtnRemove: false
  })

  tabelaDados.value.forEach((linha) => {
    linha[novoCampo] = ''
  })
}

const removerColuna = (id?: string) => {
  if (colunas.value.length <= 1) return

  if (id) {
    const indice = colunas.value.findIndex((c) => c.id === id)
    const colunasRemovidas = colunas.value.splice(indice, 1)

    if (colunasRemovidas.length > 0) {
      tabelaDados.value.forEach((linha) => {
        delete linha[id]
      })
    }
  } else {
    const colunaRemovida = colunas.value.pop()
    if (colunaRemovida) {
      tabelaDados.value.forEach((linha) => {
        delete linha[colunaRemovida.id]
      })
    }
  }
}

const removerLinha = (indice?: number) => {
  if (tabelaDados.value.length <= 1) return

  if (indice !== undefined) {
    tabelaDados.value.splice(indice, 1)
  } else tabelaDados.value.pop()
}

const addLinha = () => {
  const novaLinha: TabelaLinha = {}
  colunas.value.forEach((col) => {
    novaLinha[col.id] = ''
  })
  novaLinha['isShowBtnRemove'] = 'false'
  tabelaDados.value.push(novaLinha)
}

const preencherTabela = (propsTabela: ITabela) => {
  if (!propsTabela.linhas) {
    addColuna()
    addLinha()
    return
  }

  const tabela = props.tabela.linhas[0]

  Object.keys(tabela).forEach((chave, indice) => {
    const idColuna = `col${indice}`
    colunas.value.push({
      id: idColuna,
      nome: chave.toUpperCase(),
      isShowBtnRemove: false
    })
  })

  props.tabela.linhas
    .filter((linha) => !!linha)
    .forEach((linha) => {
      const dados: TabelaLinha = {}
      colunas.value.forEach((coluna) => {
        dados[coluna.id] = linha[coluna.nome.toLowerCase()]
      })
      dados['isShowBtnRemove'] = 'false'
      tabelaDados.value.push(dados)
    })
}

watch(
  [() => tabelaDados.value, () => colunas.value],
  () => {
    const tabelaAtualizada = {
      id: props.tabela.id,
      tipoConteudo: 'tabela',
      linhas: tabelaDados.value.map((linha) => {
        const novaLinha: { [key: string]: string } = {};
        
        colunas.value.forEach((coluna) => {
          novaLinha[coluna.nome.toLowerCase()] = linha[coluna.id];
        });

        return novaLinha;
      })
    };

    const tabelaExistente = store.notacaoItens.find((t) => t.id === tabelaAtualizada.id) as ITabela;

    if (tabelaExistente) {
      Object.assign(tabelaExistente, tabelaAtualizada);
    }
  },
  { deep: true }
);

watch(
  () => props.tabela,
  (valor) => {
    preencherTabela(valor)
  }
)

onMounted(() => {
  if (props.tabela) {
    preencherTabela(props.tabela)
  }
})
</script>
