import type { IConteudo } from '@/model/IBlueprint'
import type { IProjeto, IRecentes } from '@/model/IProjeto'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { reactive, ref } from 'vue'

export const useStoreBase = defineStore('storeBase', () => {
  const togglePreview = ref<'Html' | 'Codigo'>('Codigo')
  const markdown = ref('')
  const conteudoObj = reactive<IConteudo[]>([])
  const togglePanelHome = ref(true)
  const recentes = reactive<IRecentes[]>([])
  const projeto = reactive<IProjeto>({
    formato: '1A',
    nomeArquivo: 'doc.apib'
  })
  const abrirModalCadastro = ref(false)

  const setTogglePreview = () => {
    togglePreview.value = togglePreview.value === 'Html' ? 'Codigo' : 'Html'
  }

  const setTogglePanelHome = (value?: boolean) => {
    togglePanelHome.value = value !== undefined ? value : !togglePanelHome.value
  }

  const setMarkdown = (value: string) => {
    markdown.value = value
  }

  const setRecentes = (values: IRecentes[]) => {
    recentes.splice(0, recentes.length, ...values)
  }

  const setConteudoObj = (values: IConteudo[]) => {
    conteudoObj.splice(0, conteudoObj.length, ...values)
  }

  const setProjeto = (value: IProjeto) => {
    if (Object.keys(value).length === 0) {
      projeto.id = uuidv4()
      projeto.nomeProjeto = ''
      projeto.host = ''
    } else {
      projeto.id = value.id
      projeto.nomeProjeto = value.nomeProjeto
      projeto.host = value.host
      projeto.nomeArquivo = value.nomeArquivo
      projeto.formato = value.formato
      projeto.local = value.local
      projeto.conteudo = value.conteudo
    }
  }

  const setAbrirmodalCadastro = (abrir: boolean, id?: string) => {
    abrirModalCadastro.value = abrir

    // Chamada assincrona buscando o elemento por id.
  }

  return {
    togglePreview,
    markdown,
    conteudoObj,
    togglePanelHome,
    recentes,
    projeto,
    abrirModalCadastro,
    setTogglePreview,
    setMarkdown,
    setConteudoObj,
    setTogglePanelHome,
    setRecentes,
    setProjeto,
    setAbrirmodalCadastro
  }
})
