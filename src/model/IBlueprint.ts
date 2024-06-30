type tipoAplicacao = 'application/json'
type tipoCabecalho = 'h1' | 'h2' | 'h3'
type tipoLista = 'ordered' | 'unordered'
type tipoCodigo = 'http' | 'no-highlight'
type tipoVariacaoParametro = 'required' | 'optional'

export type TipoConteudo =
  | 'configuracao'
  | 'paragrafo'
  | 'requisicao'
  | 'detalhes_requisicao'
  | 'grupo'
  | 'codigo'
  | 'alerta'
  | 'notacao'
  | 'citacao'
  | 'tabela'
  | 'lista'
  | 'parametro'
  | 'endpoint'

export interface IConteudo {
  id: string
  tipoConteudo: TipoConteudo
  componentes?: IConteudo[]
}

export interface ICodigo extends IConteudo {
  linguagem: string
  codigo: string
}

export interface INota extends IConteudo {
  titulo?: string
}

export interface IParagrafo extends IConteudo {
  nivel: number
  titulo?: string
  texto: string
}

export interface ICitacao extends IConteudo {
  texto: string
}

export interface ILista extends IConteudo {
  estilo: 'ordered' | 'unordered'
  itens: string[]
}

export interface ITabela extends IConteudo {
  linhas: { [key: string]: string }[]
}

export interface IGrupo extends IConteudo {
  titulo: string
  endpoints: IEndpoint[]
}

export interface IEndpoint extends IConteudo {
  nome: string
  path: string
}

export interface IRequestResponse extends IConteudo {
  tipo: 'request' | 'response'
  status?: number
  verbo?: string
  formato: string
  headers?: string[]
  corpo?: string
}

export interface IParametros extends IConteudo {
  parametros: IParametroProps[]
}

export interface IParametroProps {
  [key: string]: IParametroSubProps
}

export interface IParametroSubProps {
  nome: string
  descricao: string
  tipo?: string
  variacoes?: string
  exemplo?: string
  default?: string
}
