export type TipoCard =
  | 'titulo'
  | 'texto'
  | 'codigo'
  | 'lista'
  | 'citacao'
  | 'tabela'
  | 'grupo'
  | 'alerta'
  | 'default'

export interface ICard {
  titulo?: string
  subtitulo?: string
  tipo?: TipoCard
}
