type tipoAplicacao = 'application/json'
type tipoCabecalho = 'h1' | 'h2' | 'h3'
type tipoLista = 'ordered' | 'unordered'
type tipoCodigo = 'http' | 'no-highlight'
type tipoVariacaoParametro = 'required' | 'optional'

export interface IConteudo {
  tipo: string
}

export interface ICodigo extends IConteudo {
  linguagem: string
  codigo: string
}

export interface INota extends IConteudo {
  titulo?: string
  componentes: IConteudo[]
}

export interface IParagrafo extends IConteudo {
  nivel: number
  texto: string
  descricao?: string
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
  componentes: IConteudo[]
}

export interface IRequestResponse extends IConteudo {
  tipoRequestResponse: 'request' | 'response'
  status?: number
  formato: string
  headers?: string[]
  parametros?: IParametros[]
  corpo?: string
}

export interface IParametros{
  [key: string]: IParametroProps
}

export interface IParametroProps {
  nome: string
  descricao: string
  tipo?: string
  variacoes?: string
  exemplo?: string
  default?: string
}