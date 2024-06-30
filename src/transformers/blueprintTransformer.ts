import { blueprintConstants } from '@/constants/blueprintConstants'
import type {
  ICitacao,
  ICodigo,
  IConteudo,
  IEndpoint,
  IGrupo,
  ILista,
  INota,
  IParagrafo,
  IParametroProps,
  IParametroSubProps,
  IParametros,
  IRequestResponse,
  ITabela,
  TipoConteudo
} from '@/model/IBlueprint'

import lodash from 'lodash'

const toObj = (input: string): IConteudo[] => {
  const conteudo = extrairComponentes(input)
  console.log('json', JSON.stringify(conteudo, null, 2))
  return conteudo
}

function extrairComponentes(markdown: string): IConteudo[] {
  const componentes: IConteudo[] = []
  const linhas = markdown.split('\n')

  let i = 0

  while (i < linhas.length) {
    i = extrairBloco(markdown, linhas, i, componentes)
  }

  return componentes
}

function extrairBloco(
  markdown: string,
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let i = indice
  const linhaAtual = linhas[i].trim()
  const proximaLinha = linhas[i + 1]?.trim()

  if (linhaAtual.match(blueprintConstants.REGEX_VERIFICA_NOTACAO_NOTE_OU_WARNING)) {
    i = extrairNota(markdown, linhas, i, componentes)
  } else if (linhaAtual.startsWith('# Group')) {
    i = extrairGrupo(markdown, linhas, i, componentes)
  } else if (linhaAtual.startsWith('#')) {
    i = extrairParagrafo(markdown, linhas, i, componentes)
  } else if (linhaAtual.startsWith('>')) {
    i = extrairCitacao(linhas, i, componentes)
  } else if (linhaAtual.startsWith('```')) {
    i = extrairCodigo(linhas, i, componentes)
  } else if (linhaAtual.match(/^[0-9]+\./) || linhaAtual.startsWith('*')) {
    i = extrairLista(linhas, i, componentes)
  } else if (linhaAtual.startsWith('+ Parameters')) {
    i = extrairParametros(linhas, i, componentes)
  } else if (linhaAtual.startsWith('+ Request') || linhaAtual.startsWith('+ Response')) {
    i = extrairDetalhesRequest(linhas, i, componentes)
  } else if (
    linhaAtual.includes('|') &&
    (linhaAtual.match(blueprintConstants.REGEX_IS_TABELA) ||
      proximaLinha.match(blueprintConstants.REGEX_IS_TABELA))
  ) {
    i = extrairTabela(linhas, i, componentes)
  } else if (linhaAtual) {
    i = extrairParagrafo(markdown, linhas, i, componentes)
  } else {
    i++
  }

  return i
}

function extrairNota(
  markdown: string,
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let proximaLinha = indice + 1
  const tipoNota = linhas[indice].includes('warning') ? 'warning' : 'note'
  const notaComponentes: IConteudo[] = []
  let titulo = ''

  while (
    proximaLinha < linhas.length &&
    !linhas[proximaLinha].trim().match(blueprintConstants.REGEX_VERIFICA_NOTACAO_NOTE_FECHAMENTO) &&
    !linhas[proximaLinha].trim().startsWith('# Group') &&
    !linhas[proximaLinha].trim().startsWith('+')
  ) {
    const result = extrairBloco(markdown, linhas, proximaLinha, notaComponentes)
    proximaLinha = result

    // A note de warnning está aninhando texto e sobrepondo o group.
    if (tipoNota === 'warning' && linhas[proximaLinha]?.startsWith('#### ')) {
      titulo = linhas[proximaLinha].replace('#### ', '').trim()
    }
  }

  const tipoConteudo: TipoConteudo = tipoNota === 'warning' ? 'alerta' : 'notacao'

 componentes.push({ id: lodash.uniqueId(),  tipoConteudo, titulo, componentes: notaComponentes } as INota)

  if (!linhas[proximaLinha]?.startsWith('# Group') && !linhas[proximaLinha]) {
    proximaLinha++
  }

  return proximaLinha
}

function extrairGrupo(
  markdown: string,
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let indicePrincipal = indice
  const linhaAtual = linhas[indicePrincipal].trim()

  // Extrair o título do grupo
  const matchTitulo = linhaAtual.match(/# Group (.+)/)
  const titulo = matchTitulo ? matchTitulo[1] : ''

  // Extrair a descrição do grupo
  // let descricao = ''
  indicePrincipal++
  let conteudoDaProxLinha = linhas[indicePrincipal]?.trim()

  // if (proximaLinha && !proximaLinha.startsWith('#')) {
  //   descricao = proximaLinha
  //   indicePrincipal++

  //   while (
  //     indicePrincipal < linhas.length &&
  //     linhas[indicePrincipal].trim() &&
  //     !linhas[indicePrincipal].startsWith('#')
  //   ) {
  //     descricao += ' ' + linhas[indicePrincipal].trim()
  //     indicePrincipal++
  //   }
  // }

  const grupoComponentes: IConteudo[] = []

  // extrair o endpoint

  // Iterar sobre os blocos dentro do grupo
  while (indicePrincipal < linhas.length && !linhas[indicePrincipal].trim().startsWith('# Group')) {
    const result = extrairEndpoint(markdown, linhas, indicePrincipal, grupoComponentes)
    indicePrincipal = result
    conteudoDaProxLinha = linhas[result]?.trim()
  }

  // Adicionar o grupo com seus componentes ao array principal
  componentes.push({
    id: lodash.uniqueId(),
    tipoConteudo: 'grupo',
    titulo,
    endpoints: grupoComponentes as IEndpoint[]
  } as IGrupo)

  return indicePrincipal
}

function extrairEndpoint(
  markdown: string,
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let indicePrincipal = indice
  const conteudoLinhaAtual = linhas[indicePrincipal].trim()
  let conteudoDaProxLinha = linhas[indicePrincipal]?.trim()
  const match = conteudoLinhaAtual.match(blueprintConstants.REGEX_IS_TITULO_ENDPOINT_COMPLETO)

  const nome = match?.[1] || ''
  const path = match?.[2] || ''

  indicePrincipal += linhas[indicePrincipal + 1] ? 1 : 2

  const endpointComponentes: IConteudo[] = []

  while (indicePrincipal < linhas.length && !linhas[indicePrincipal].startsWith('##') && !linhas[indicePrincipal].startsWith('# Group')) {
    while (indicePrincipal < linhas.length && !linhas[indicePrincipal].startsWith('###')) {
      const result = extrairBloco(markdown, linhas, indicePrincipal, endpointComponentes)
      indicePrincipal = result
      conteudoDaProxLinha = linhas[result]?.trim()
    }

    // Faz a extração dos requests [GET, POST] aninhados com os detalhes.
    while (indicePrincipal < linhas.length && linhas[indicePrincipal].startsWith('###')) {
      const result = extrairRequest(markdown, linhas, indicePrincipal, endpointComponentes)
      indicePrincipal = result
      conteudoDaProxLinha = linhas[result]?.trim()
    }
  }

  componentes.push({
    id: lodash.uniqueId(),
    tipoConteudo: 'endpoint',
    nome,
    path,
    componentes: endpointComponentes
  } as IEndpoint)

  return indicePrincipal
}

function extrairParagrafo(
  markdown: string,
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let i = indice
  const linhaAtual = linhas[i].trim()
  const match = linhaAtual.match(/^(#+)\s*(.*)/)

  if (match) {
    const nivel = match[1].length
    let titulo = match[2].trim()

    if (nivel === 1) {
     componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'configuracao', nivel, texto: titulo } as IParagrafo)
    } else {
      const proximaLinha = linhas[i + 1]?.trim()

      /**
       * Cria uma sessão de paragrafos para o titulo nivel 2 Ex.
       * ## Sobre
       * Lorem ispsum Lorem ispsum Lorem ispsum
       * Lorem ispsum Lorem ispsum Lorem ispsum
       * Lorem ispsum Lorem ispsum Lorem ispsum
       * 
       * ### Subitulo
       * Lorem ispsum Lorem ispsum Lorem ispsum

       **/
      if (
        nivel === 2 &&
        !titulo.match(blueprintConstants.REGEX_IS_TITULO_ENDPOINT) &&
        !titulo.match(blueprintConstants.REGEX_IS_TITULO_REQUEST)
      ) {
        i += proximaLinha ? 1 : 2
        const sessaoParagrafo: IConteudo[] = []

        while (
          i < linhas.length &&
          linhas[i].trim() &&
          !linhas[i].startsWith('## ') &&
          !linhas[i].match(blueprintConstants.REGEX_VERIFICA_NOTACAO_NOTE)
        ) {
          const resultado = extrairBloco(markdown, linhas, i, sessaoParagrafo)
          i = linhas[resultado]?.trim() ? resultado : resultado + 1
        }

        componentes.push({
          id: lodash.uniqueId(),
          tipoConteudo: 'paragrafo',
          nivel,
          titulo,
          componentes: sessaoParagrafo
        } as IParagrafo)
        return i
      } else if (proximaLinha && !proximaLinha.startsWith('#')) {
        /**
         * Agrupa em um paragrafo um titulo com paragrafos simples descritos na linha seguinte. Ex.
         * ## Sobre
         * Lorem ispsum Lorem ispsum Lorem ispsum
         **/
        let texto = ''
        i++

        while (
          i < linhas.length &&
          linhas[i].trim() &&
          !linhas[i].startsWith('#') &&
          !linhas[i].match(blueprintConstants.REGEX_VERIFICA_NOTACAO_NOTE)
        ) {
          texto += ' ' + linhas[i].trim()
          i++
        }

        titulo = titulo.replace('<i class="fa fa-warning"></i>', '').trim()
       componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'paragrafo', nivel, titulo, texto } as IParagrafo)
      } else {
       componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'paragrafo', nivel, titulo } as IParagrafo)
      }
    }
  } else if (linhaAtual.includes('FORMAT:') || linhaAtual.includes('HOST:')) {
    const titulo = linhaAtual.substring(0, linhaAtual.indexOf(':')).trim()
    const texto = linhaAtual.substring(linhaAtual.indexOf(':') + 1).trim()
   componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'configuracao', nivel: 0, titulo, texto } as IParagrafo)

    // Valida titulo de tabela.
  } else if (linhaAtual.includes('|') && linhas[i + 1].trim().includes('--:')) {
    i++

    // Valida linha final de nota.
  } else if (linhaAtual.trim().match(blueprintConstants.REGEX_VERIFICA_NOTACAO_NOTE_FECHAMENTO)) {
    i++
  }
  // Agrupamento de Paragrafos simples de continuação.
  else if (linhaAtual && !linhaAtual.startsWith('#')) {
    let texto = ''

    while (i < linhas.length && linhas[i].trim() && !linhas[i].startsWith('#')) {
      texto += ' ' + linhas[i].trim()
      i++
    }
   componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'paragrafo', nivel: 0, texto } as IParagrafo)
  } else {
   componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'paragrafo', nivel: 0, texto: linhaAtual } as IParagrafo)
  }

  i++
  return i
}

function extrairRequest(
  markdown: string,
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let i = indice
  const linhaAtual = linhas[i].trim()
  const match = linhaAtual.match(/^###\s*(.*)\s*\[(.*)\]$/)

  if (match) {
    const texto = match[1].trim()
    const verbo = match[2].trim()
    const requestComponentes: IConteudo[] = []
    i++

    while (
      i < linhas.length &&
      !linhas[i].startsWith('###') &&
      !linhas[i].startsWith('#') &&
      !linhas[i].startsWith('##')
    ) {
      if (linhas[i].startsWith('+ Request')) {
        i = extrairDetalhesRequest(linhas, i, requestComponentes)
      } else if (linhas[i].startsWith('+ Response')) {
        i = extrairDetalhesRequest(linhas, i, requestComponentes)
      } else if (linhas[i].startsWith('+ Parameters')) {
        i = extrairParametros(linhas, i, componentes)
      } else {
        const result = extrairBloco(markdown, linhas, i, requestComponentes)
        i = result
      }
    }

    componentes.push({
      id: lodash.uniqueId(),
      tipoConteudo: 'requisicao',
      nivel: 3,
      texto: texto,
      verbo: verbo,
      componentes: requestComponentes
    } as IParagrafo)
  } else {
    i++
  }

  return i
}

function extrairDetalhesRequest(
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let i = indice
  const linhaAtual = linhas[i].trim()

  let tipo: 'request' | 'response' = 'request'
  let corpo = ''
  let verbo = ''
  let status = 0
  let formato = ''
  const headers: string[] = []

  if (linhaAtual.startsWith('+ Request')) {
    tipo = 'request'
    const match = linhaAtual.match(/\[([A-Z]+)\]/)
    verbo = match ? match[1] : ''
  } else if (linhaAtual.startsWith('+ Response')) {
    tipo = 'response'
    const match = linhaAtual.match(/([0-9]{3})/)
    status = match ? parseInt(match[1]) : 0
    const formatoMatch = linhaAtual.match(/\((.*?)\)/)
    formato = formatoMatch ? formatoMatch[1] : ''
  }

  // Verifica se a prox linha contem info, se não pula para proxima
  i = linhas[i + 1].trim() ? i + 1 : i + 2

  /** Montagem do request
   * request >>
   *   > headers
   *   > body
   * ***/
  while (i < linhas.length) {
    const linha = linhas[i].trim()
    if (linha.startsWith('+ Headers')) {
      i = linhas[i + 1].trim() ? i + 1 : i + 2
      while (i < linhas.length && linhas[i].trim()) {
        const header = linhas[i].trim().replace(/^\s+/, '')
        headers.push(header)
        i++
      }
      i++
    } else if (linha.startsWith('+ Body')) {
      i = linhas[i + 1].trim() ? i + 1 : i + 2
      while (i < linhas.length && linhas[i].trim()) {
        corpo += linhas[i].trim().replace(/^\s+/, '')
        i++
      }
      //Body implicito
    } else if (linha.startsWith('{') || linha.startsWith('[')) {
      while (i < linhas.length && linhas[i].trim()) {
        corpo += linhas[i].trim()
        i++
      }
    } else {
      break
    }
  }

  componentes.push({
    id: lodash.uniqueId(),
    tipoConteudo: 'detalhes_requisicao',
    tipo,
    verbo,
    status,
    formato,
    headers,
    // parametros,
    corpo: corpo.trim()
  } as IRequestResponse)

  return i
}

function extrairParametros(linhas: string[], indice: number, componentes: IConteudo[]): number {
  let i = linhas[indice + 1].trim() ? indice + 1 : indice + 2
  const parametros: IParametroProps[] = []

  while (i < linhas.length && linhas[i].trim()) {
    let linha = linhas[i].trim()

    if (linha.startsWith('+') && linha.includes(':')) {
      if (linhas[i + 1].trim().startsWith('+ Default')) {
        const linhaDefault = linhas[i + 1].trim()
        linha += ' ' + linhaDefault
        parametros.push(criarParametros(linha))
      } else {
        parametros.push(criarParametros(linha))
      }

      i++
    } else {
      break
    }
  }

 componentes.push({ id: lodash.uniqueId(),  parametros } as IParametros)
  return i
}

function criarParametros(parametros: string): IParametroProps {
  const parametrosExtraidos: IParametroProps = {}
  const match = parametros.match(blueprintConstants.REGEX_IS_PARAMETRO)

  if (match) {
    const nome = match[1]
    const exemplo = match[2]
    const tipoVariacoes = match[3]
    const descricao = match[4]
    const valorPadrao = match[5]

    let tipo = ''
    let variacoes = 'required'

    if (tipoVariacoes) {
      tipo = tipoVariacoes.split(',')[0].trim()
      if (tipoVariacoes.split(',').length > 1) {
        variacoes = tipoVariacoes.split(',')[1].trim() ?? 'required'
      }
    }

    const parametroProps: IParametroSubProps = {
      nome,
      exemplo,
      descricao,
      tipo,
      variacoes
    }

    if (valorPadrao) {
      parametroProps.default = valorPadrao.trim()
    }

    parametrosExtraidos[nome] = parametroProps
  }

  return parametrosExtraidos
}

function extrairCitacao(linhas: string[], indice: number, componentes: IConteudo[]): number {
  let i = indice
  let texto = linhas[i].slice(1).trim()
  i++
  while (i < linhas.length && linhas[i].startsWith('>')) {
    texto += '\n' + linhas[i].slice(1).trim()
    i++
  }
 componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'citacao', texto } as ICitacao)
  return i
}

function extrairCodigo(linhas: string[], indice: number, componentes: IConteudo[]): number {
  let i = indice
  const linguagem = linhas[i].trim().slice(3).trim()
  let codigo = ''
  i++
  while (i < linhas.length && !linhas[i].trim().startsWith('```')) {
    codigo += linhas[i].trim() + '\n'
    i++
  }
  i++ // Pula o fechamento ```
 componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'codigo', linguagem, codigo: codigo.trim() } as ICodigo)
  return i
}

function extrairLista(linhas: string[], indice: number, componentes: IConteudo[]): number {
  let i = indice
  const estilo = linhas[i].match(/^[0-9]+\./) ? 'ordered' : 'unordered'
  const itens = []
  while (i < linhas.length && (linhas[i].match(/^[0-9]+\./) || linhas[i].startsWith('*'))) {
    itens.push(linhas[i].replace(/^[0-9]+\.\s*|\*\s*/, '').trim())
    i++
  }
 componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'lista', estilo, itens } as ILista)
  return i
}

function extrairTabela(linhas: string[], indice: number, componentes: IConteudo[]): number {
  let i = indice
  const linhaAtual = linhas[i].trim()
  const linhaAnterior = linhas[i - 1].trim()

  /* Checa se o cabecalho da tabela está na linha atual ou na linha anterior.
    @Exemplo: 
      linha atual: A | B ou --: | --  <-> linha anterior a A | B;
  */
  const isCabecalhoNaLinhaAnterior = linhaAtual.match(/^\s*:?-{1,}:?\s*(\|\s*:?-*:?\s*)+$/)
  let cabecalho = isCabecalhoNaLinhaAnterior ? linhaAnterior : linhaAtual

  // Verifica se a tabela está no formato incorreto, | A | B | C.
  // Formato correto A | B | C, sem o palpe inicial.
  if (cabecalho.match(/^\s*\|\s*[A-Za-z].*$/))
    cabecalho = cabecalho.substring(cabecalho.indexOf('|') + 1)

  //Separa as colunas
  const colunas = cabecalho.split('|').map((coluna) => lodash.deburr(coluna.trim().toLowerCase()))
  const linhasTabela: { [key: string]: string }[] = []

  i += isCabecalhoNaLinhaAnterior ? 1 : 2

  while (i < linhas.length && linhas[i].includes('|')) {
    // Linha com os valores.
    let valoresSrt = linhas[i]

    // Verifica se a tabela está no formato incorreto, | A | B | C.
    // Formato correto A | B | C, sem o palpe inicial.
    if (valoresSrt.match(/^\s*\|\s*[A-Za-z].*$/))
      valoresSrt = valoresSrt.substring(valoresSrt.indexOf('|') + 1)

    const valores = valoresSrt.split('|').map((valor) => valor.trim())

    // Remove o valor vazio gerado pelo palpe inicial informado incorretamente.
    // e alinha os valores em conformidade com as colunas.
    // col1 | col2
    //      | val1  | val2
    //Resultado:  col1=val1, col2=val2
    if (colunas.length < valores.length && !valores[0]) {
      valores.splice(0, 1)
    }

    const linhaObj: { [key: string]: string } = {}

    colunas
      .filter((valor) => valor.trim())
      .forEach((coluna, idx) => {
        linhaObj[coluna] = valores[idx]
      })

    linhasTabela.push(linhaObj)
    i++
  }
 componentes.push({ id: lodash.uniqueId(),  tipoConteudo: 'tabela', linhas: linhasTabela } as ITabela)
  return i
}

export const blueprintTransformer = {
  toObj
}
