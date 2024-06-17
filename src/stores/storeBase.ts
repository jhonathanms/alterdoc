import type { IProjeto } from '@/service/interfaces/IProjeto';
import type { IRecentes } from '@/service/interfaces/IRecentes';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { reactive, ref } from 'vue';

export const useStoreBase = defineStore('storeBase', () => {
  const togglePreview = ref<'Html' | 'Codigo'>('Codigo')
  const conteudoMD = ref('')
  const togglePanelHome = ref(true)
  const recentes = reactive<IRecentes[]>([])
  const projeto = reactive<IProjeto>({
    formato: '1A',
    nomeArquivo: 'doc.apib'
  })

  const setTogglePreview = () => {
    togglePreview.value = togglePreview.value === 'Html' ? 'Codigo' : 'Html'
  }

  const setTogglePanelHome = (valor?: boolean) => {
    togglePanelHome.value = valor !== undefined ? valor : !togglePanelHome.value
  }

  const setConteudoMD = (value: string) => {
    conteudoMD.value = value
  }

  const setRecentes = (values: IRecentes[]) => {
    recentes.splice(0, recentes.length, ...values)
  }

  const setProjeto = (value: IProjeto) => {
    if (Object.keys(value).length === 0) {
      projeto.id = uuidv4()
      projeto.nomeProjeto = ''
      projeto.host = ''
      
    } else {
      projeto.id =value.id
      projeto.nomeProjeto = value.nomeProjeto
      projeto.host = value.host
      projeto.nomeArquivo = value.nomeArquivo
      projeto.formato = value.formato
      projeto.local = value.local
      projeto.conteudo = value.conteudo
    }
  }

  return {
    togglePreview,
    conteudoMD,
    togglePanelHome,
    recentes,
    projeto,
    setTogglePreview,
    setConteudoMD,
    setTogglePanelHome,
    setRecentes,
    setProjeto
  }
})
