import type { IRecentes } from '@/service/interfaces/IRecentes'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useStoreBase = defineStore('storeBase', () => {
  const togglePreview = ref<'Html' | 'Codigo'>('Codigo')
  const conteudoMD = ref('')
  const togglePanelHome = ref(true)
  const recentes = reactive<IRecentes[]>([])

  const setTogglePreview = () => {
    togglePreview.value = togglePreview.value === 'Html' ? 'Codigo' : 'Html'
  }

  const setTogglePanelHome = () => {
    togglePanelHome.value = !togglePanelHome.value
  }

  const setConteudoMD = (value: string) => {
    conteudoMD.value = value
  }

  const setRecentes = (values: IRecentes[]) => {
    recentes.splice(0, recentes.length, ...values)
  }

  return {
    togglePreview,
    conteudoMD,
    togglePanelHome,
    recentes,
    setTogglePreview,
    setConteudoMD,
    setTogglePanelHome,
    setRecentes
  }
})
