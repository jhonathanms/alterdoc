import type {
  ICitacao,
  ICodigo,
  IConteudo,
  IGrupo,
  ILista,
  INota,
  IParagrafo,
  IParametroProps,
  IParametros,
  IRequestResponse,
  ITabela,
  TipoConteudo
} from '../model/IBlueprint'

const toObj = (input: string): IConteudo[] => {
  return extrairComponentes(input)
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
  const proximaLinha = linhas[i + 1]?.trim();

  if (linhaAtual.startsWith('::: note') || linhaAtual.startsWith('::: warning')) {
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
  } else if (linhaAtual.startsWith('+ Request') || linhaAtual.startsWith('+ Response')) {
    i = extrairDetalhesRequest(linhas, i, componentes)
  } else if (
        linhaAtual.includes('|') 
        && (linhaAtual.match(/^\s*:?-{1,}:?\s*(\|\s*:?-*:?\s*)+$/) || proximaLinha.match(/^\s*:?-{1,}:?\s*(\|\s*:?-*:?\s*)+$/))
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
    !linhas[proximaLinha].startsWith(':::') &&
    !linhas[proximaLinha].startsWith('# Group')
  ) {
    const result = extrairBloco(markdown, linhas, proximaLinha, notaComponentes)
    proximaLinha = result

    // A note de warnning está aninhando texto e sobrepondo o group.
    if (tipoNota === 'warning' && linhas[proximaLinha]?.startsWith('#### ')) {
      titulo = linhas[proximaLinha].replace('#### ', '').trim()
    }
  }

  const tipoConteudo: TipoConteudo = tipoNota === 'warning' ? 'alerta' : 'notacao'

  componentes.push({ tipoConteudo, titulo, componentes: notaComponentes } as INota)
  
  if(!linhas[proximaLinha].startsWith('# Group')) {
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
  let descricao = ''
  indicePrincipal++
  let proximaLinha = linhas[indicePrincipal]?.trim()
  if (proximaLinha && !proximaLinha.startsWith('#')) {
    descricao = proximaLinha
    indicePrincipal++
    while (
      indicePrincipal < linhas.length &&
      linhas[indicePrincipal].trim() &&
      !linhas[indicePrincipal].startsWith('#')
    ) {
      descricao += ' ' + linhas[indicePrincipal].trim()
      indicePrincipal++
    }
  }

  const grupoComponentes: IConteudo[] = []

  // Iterar sobre os blocos dentro do grupo
  while (indicePrincipal < linhas.length && !linhas[indicePrincipal].startsWith('###')) {
    const result = extrairBloco(markdown, linhas, indicePrincipal, grupoComponentes)
    indicePrincipal = result
    proximaLinha = linhas[result]?.trim()
  }

  // Faz a extração dos requests [GET, POST] aninhados com os detalhes.
  while (indicePrincipal < linhas.length && linhas[indicePrincipal].startsWith('###')) {
    const result = extrairRequest(markdown, linhas, indicePrincipal, grupoComponentes)
    indicePrincipal = result
    proximaLinha = linhas[result]?.trim()
  }

  // Adicionar o grupo com seus componentes ao array principal
  componentes.push({
    tipoConteudo: 'grupo',
    titulo,
    descricao,
    componentes: grupoComponentes as IConteudo[]
  } as IGrupo)

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
    let texto = match[2].trim()

    if (nivel === 1) {
      componentes.push({ tipoConteudo: 'configuracao', nivel, texto } as IParagrafo)
    } else {
      const proximaLinha = linhas[i + 1]?.trim()

      if (proximaLinha && !proximaLinha.startsWith('#')) {
        let descricao = ''
        i++

        while (
          i < linhas.length &&
          linhas[i].trim() &&
          !linhas[i].startsWith('#') &&
          !linhas[i].startsWith(':::')
        ) {
          descricao += ' ' + linhas[i].trim()
          i++
        }

        texto = texto.replace('<i class="fa fa-warning"></i>', '').trim()
        componentes.push({ tipoConteudo: 'paragrafo', nivel, texto, descricao } as IParagrafo)
      } else {
        componentes.push({ tipoConteudo: 'paragrafo', nivel, texto } as IParagrafo)
      }
    }

  } else if (linhaAtual.includes('FORMAT:') || linhaAtual.includes('HOST:')) {
    const descricao = linhaAtual.substring(0, linhaAtual.indexOf(':')).trim()
    const texto = linhaAtual.substring(linhaAtual.indexOf(':') + 1).trim()
    componentes.push({ tipoConteudo: 'configuracao', nivel: 0, descricao, texto } as IParagrafo)
  
  } else if (linhaAtual.includes('|') && linhas[i + 1].trim().includes('--:')) {
    i++

  }
  // Agrupamento de Paragrafos simples de continuação.
  else if (linhaAtual && !linhaAtual.startsWith('#')) {
    let descricao = ''

    while (i < linhas.length && linhas[i].trim() && !linhas[i].startsWith('#')) {
      descricao += ' ' + linhas[i].trim()
      i++
    }
    componentes.push({ tipoConteudo: 'paragrafo', nivel: 0, texto: descricao } as IParagrafo)

  } else {
    componentes.push({ tipoConteudo: 'paragrafo', nivel: 0, texto: linhaAtual } as IParagrafo)
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
      } else {
        const result = extrairBloco(markdown, linhas, i, requestComponentes)
        i = result
      }
    }

    componentes.push({
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
  const parametros: IParametros[] = []

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

  while (i < linhas.length) {
    const linha = linhas[i].trim()
    if (linha.startsWith('+ Parameters')) {
      i = extrairParametros(linhas, i, parametros)
      i++
    } else if (linha.startsWith('+ Headers')) {
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
    tipoConteudo: 'detalhes_requisicao',
    tipo,
    verbo,
    status,
    formato,
    headers,
    parametros,
    corpo: corpo.trim()
  } as IRequestResponse)

  return i
}

function extrairParametros(
  linhas: string[],
  indice: number,
  componentes: IParametros[]
): number {
  let i = linhas[indice + 1].trim() ? indice + 1 : indice + 2

  while (i < linhas.length && linhas[i].trim()) {
    let linha = linhas[i].trim()

    if (linha.startsWith('+') && linha.includes(':')) {
      if (linhas[i + 1].trim().startsWith('+ Default')) {
        const linhaDefault = linhas[i + 1].trim()
        linha += ' ' + linhaDefault
        componentes.push(criarParametros(linha))
      } else {
        componentes.push(criarParametros(linha))
      }

      i++
    } else {
      break
    }
  }

  return i
}

function criarParametros(parametros: string): IParametros {
  const parametrosExtraidos: IParametros = {}

  const match = parametros.match(
    /^\+\s*(\w+):\s*`(.+?)`\s*(?:\(([^)]+)\))?\s*-\s*(.*?)(?:\s*\+\s*Default:\s*`?([^`]+)`?)?$/
  )

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

    const parametroProps: IParametroProps = {
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
  componentes.push({ tipoConteudo: 'citacao', texto } as ICitacao)
  return i
}

function extrairCodigo(linhas: string[], indice: number, componentes: IConteudo[]): number {
  let i = indice
  const linguagem = linhas[i].slice(3).trim()
  let codigo = ''
  i++
  while (i < linhas.length && !linhas[i].startsWith('```')) {
    codigo += linhas[i] + '\n'
    i++
  }
  i++ // Pula o fechamento ```
  componentes.push({ tipoConteudo: 'codigo', linguagem, codigo: codigo.trim() } as ICodigo)
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
  componentes.push({ tipoConteudo: 'lista', estilo, itens } as ILista)
  return i
}

function extrairTabela(
  linhas: string[],
  indice: number,
  componentes: IConteudo[]
): number {
  let i = indice
  const linhaAtual = linhas[i].trim()
  const linhaAnterior = linhas[i - 1].trim()

  /* Checa se o cabecalho da tabela está na linha atual ou na linha anterior.
    @Exemplo: 
      linha atual: A | B ou --: | --  <-> linha anterior a A | B;
  */
  const isCabecalhoNaLinhaAnterior = linhaAtual.match(/^\s*:?-{1,}:?\s*(\|\s*:?-*:?\s*)+$/)
  const cabecalho =  isCabecalhoNaLinhaAnterior ? linhaAnterior : linhaAtual

  //Separa as colunas
  const colunas = cabecalho.split('|').map((coluna) => coluna.trim().toLowerCase())
  const linhasTabela: { [key: string]: string }[] = []
  
  i += isCabecalhoNaLinhaAnterior ? 1 : 2

  while (i < linhas.length && linhas[i].includes('|')) {
    const valores = linhas[i].split('|').map((valor) => valor.trim())
    const linhaObj: { [key: string]: string } = {}
    colunas
      .filter((valor) => valor.trim())
      .forEach((coluna, idx) => {
        linhaObj[coluna] = valores[idx]
      })
    linhasTabela.push(linhaObj)
    i++
  }
  componentes.push({ tipoConteudo: 'tabela', linhas: linhasTabela } as ITabela)
  return i
}

export const blueprintTransformer = {
  toObj
}
