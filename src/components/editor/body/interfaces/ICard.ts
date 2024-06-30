import type { TipoConteudo } from "@/model/IBlueprint"

export interface ICard {
  id: string,
  titulo?: string
  subtitulo?: string
  tipo?: TipoConteudo | 'default'
}
