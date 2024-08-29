import type { IConteudo } from '@/model/IBlueprint'
import type { IModalBase, IProjeto, IRecentes } from '@/model/IProjeto'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { reactive, ref } from 'vue'

export const useStoreBase = defineStore('storeBase', () => {
  const togglePreview = ref<'Html' | 'Codigo'>('Codigo')
  const markdown = ref('')
  const conteudoBlueprint = ref('')
  const conteudoObj = reactive<IConteudo[]>([])
  const togglePanelHome = ref(true)
  const recentes = reactive<IRecentes[]>([])
  const modal = reactive<IModalBase>({
    cabecalho: '',
    tipo: 'default',
    conteudo: {},
    abrir: false,
    isEdicao: false,
    maximize: false,
    continuarAdicionando: false
  } as IModalBase)

  const notacaoItens = reactive<IConteudo[]>([])
  const lockDebounceNotacaoParagrafo = ref(false)

  const setModalMaximize = () => {
    modal.maximize = true
  }

  const setModalUnMaximize = () => {
    modal.maximize = false
  }

  const setModalContinuarAdicionando = (value: boolean) => {
    modal.continuarAdicionando = value
  }

  const projeto = reactive<IProjeto>({
    formato: '1A',
    nomeArquivo: 'doc.apib'
  })

  const setTogglePreview = () => {
    togglePreview.value = togglePreview.value === 'Html' ? 'Codigo' : 'Html'
  }

  const setTogglePanelHome = (value?: boolean) => {
    togglePanelHome.value = value !== undefined ? value : !togglePanelHome.value
  }

  const setMarkdown = (value: string) => {
    markdown.value = value
  }

  const setConteudoBlueprint = (value: string) => {
    conteudoBlueprint.value = value
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

  const setModal = (props: Partial<IModalBase>) => {
    Object.assign(modal, {
      ...({
        cabecalho: '',
        tipo: 'default',
        conteudo: {},
        abrir: false,
        isEdicao: false,
        maximize: false,
        continuarAdicionando: false
      } as IModalBase),
      ...props
    })
  }

  const setLockDebounceNotacaoParagrafo = (valor: boolean) => {
    lockDebounceNotacaoParagrafo.value = valor
  }

  return {
    togglePreview,
    markdown,
    conteudoBlueprint,
    conteudoObj,
    togglePanelHome,
    recentes,
    projeto,
    modal,
    notacaoItens,
    lockDebounceNotacaoParagrafo,
    setTogglePreview,
    setMarkdown,
    setConteudoBlueprint,
    setConteudoObj,
    setTogglePanelHome,
    setRecentes,
    setProjeto,
    setModal,
    setModalUnMaximize,
    setModalMaximize,
    setModalContinuarAdicionando,
    setLockDebounceNotacaoParagrafo
  }
})
