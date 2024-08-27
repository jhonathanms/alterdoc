import type { IConteudo, TipoConteudo } from '@/model/IBlueprint'

export interface ICard {
  titulo?: string
  subtitulo?: string
  tipo?: TipoConteudo | 'default'
}

export interface ICardNotacao extends ICard {
  conteudo?: IConteudo
}
