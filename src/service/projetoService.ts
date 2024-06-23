import type { IConteudo, IParagrafo } from "@/model/IBlueprint"
import type { IProjeto } from "@/model/IProjeto"
import { blueprintTransformer } from "@/transformers/blueprintTransformer"
import { storageConstants } from "./constants/storageConstants"
import storageService from '@/service/storageService'
import { v4 as uuidv4 } from 'uuid'

const criar = (markdown: string, file?: File): IProjeto => {
    const projeto: IProjeto = {
      id: uuidv4(),
      nomeArquivo: file?.name || ''
    }
  
    const conteudo = blueprintTransformer.toObj(markdown)
    atualizarConfiguracao(conteudo, projeto)
    projeto.conteudo = conteudo

    storageService.setItem(storageConstants.PROJETO, projeto)
    return projeto
}

const atualizarConfiguracao = (conteudo: IConteudo[], projeto: IProjeto)=> {
    return conteudo
    .filter((obj) => obj.tipoConteudo === 'configuracao')
    .forEach((obj) => {
      const paragrafo = obj as IParagrafo
      if (paragrafo.descricao === 'FORMAT') projeto.formato = paragrafo.texto
      if (paragrafo.descricao === 'HOST') projeto.host = paragrafo.texto
      if (paragrafo.nivel === 1) projeto.nomeProjeto = paragrafo.texto
    })
}

export const projetoService = {
    criar,
    atualizarConfiguracao
}