<template>
  <div class="grid gap-2 align-items-center surface-100 border-round text-xs m-0">
    <div class="col-fixed w-3rem">
      <Avatar :label="sigla" class="mr-2" />
    </div>

    <div class="col">
      <div class="grid">
        <div class="col-7 text-overflow-ellipsis white-space-nowrap overflow-hidden">
          <span class="font-bold text-700">Projeto:</span> {{ props.nomeProjeto }}
        </div>
        <div class="col-5 justify-content-end">
          <span class="text-xs text-500">{{ props.ultimoAcesso }}</span>
        </div>
      </div>

      <div class="grid">
        <div class="col w-3rem overflow-x-hidden text-overflow-ellipsis white-space-nowrap">
          <span class="font-bold text-700">Local:</span> {{ props.localProjeto }}
        </div>
      </div>
    </div>

    <div class="col-fixed w-2rem">
      <div class="card flex justify-content-center">
        <Button
          text
          severity="secondary"
          icon="pi pi-ellipsis-v"
          @click="toggleMenu"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <Menu
          ref="menu"
          id="overlay_menu"
          :model="menuItems"
          :popup="true"
          pt:submenuHeader:class="hidden"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storageConstants } from '@/service/constants/storageConstants'
import type { IRecentes } from '@/model/IProjeto'
import storageService from '@/service/storageService'
import { useStoreBase } from '@/stores/storeBase'
import { computed, reactive, ref } from 'vue'

const { props } = defineProps<{ props: IRecentes }>()
const store = useStoreBase()
const menu = ref()

const sigla = computed(() => {
  if (!props.nomeProjeto) return ''

  const palavras = props.nomeProjeto.split(' ')
  let iniciais = ''

  for (let i = 0; i < Math.min(palavras.length, 2); i++) {
    iniciais += palavras[i].charAt(0).toUpperCase()
  }

  return iniciais
})

const getColorDefault = computed(() => {
  const projeto = storageService.getItem(storageConstants.PROJETO_DEFAULT) as IRecentes
  return props.id === projeto.id
})

const menuItems = reactive([
  {
    items: [
      {
        label: 'Default',
        icon: 'pi pi-star',
        command: () => handleDefault()
      },
      {
        label: 'Remover',
        icon: 'pi pi-times',
        class: 'text-red-500',
        command: () => handleRemover()
      }
    ]
  }
])

const toggleMenu = (event: any) => {
  menu.value.toggle(event)
}

const handleDefault = () => {
  storageService.setItem(storageConstants.PROJETO_DEFAULT, props)
}

const handleRemover = () => {
  let recentes = storageService.getItem(storageConstants.RECENTES) as IRecentes[]
  recentes = recentes.filter((registro) => registro.id !== props.id)

  storageService.setItem(storageConstants.RECENTES, recentes)

  store.setRecentes(recentes)
}
</script>
