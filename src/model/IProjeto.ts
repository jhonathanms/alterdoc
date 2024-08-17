import type { IConteudo, TipoConteudo } from './IBlueprint'

export interface IProjeto {
  id?: string
  nomeProjeto?: string
  nomeArquivo?: string
  local?: string
  formato?: string
  host?: string
  conteudo?: IConteudo[]
}

export interface IRecentes {
  id?: string
  nomeProjeto?: string
  localProjeto?: string
  ultimoAcesso?: string
}

export interface IModalBase {
  cabecalho: string
  tipo: TipoConteudo | 'default'
  conteudo: any
  abrir: boolean
  isEdicao: boolean
}
