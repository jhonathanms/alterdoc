import type { TipoConteudo } from "@/model/IBlueprint"

export interface ICard {
  titulo?: string
  subtitulo?: string
  tipo?: TipoConteudo | 'default'
}
