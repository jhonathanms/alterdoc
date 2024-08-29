import { appConstants } from '@/constants/appConstants'
import type { IConteudo, IParagrafo } from '@/model/IBlueprint'
import { appUtils } from './../utils/appUtils'

const parseParagrafosFilhos = (html: string, filhos?: IConteudo[]): string => {
  if (filhos && filhos.length > 0) {
    for (const componente of filhos) {
      html += toHtml(componente as IParagrafo)
    }
  }

  return html
}

const parseFormatacaoBlueprintParaHtml = (texto: string): string => {
  if (texto) {
    const TAG_STRONG = '<strong>$1</strong>'
    const TAG_EM = '<em>$1</em>'
    const TAG_A = '<a href="$2">$1</a>'
    const TAG_CODE = '<code>$1</code>'

    texto = texto.replace(appConstants.REGEX_IS_STRONG_BLUEPRINT, TAG_STRONG)
    texto = texto.replace(appConstants.REGEX_IS_ITALIC_BLUEPRINT, TAG_EM)
    texto = texto.replace(appConstants.REGEX_IS_LINK_BLUEPRINT, TAG_A)
    texto = texto.replace(appConstants.REGEX_IS_CODE_BLUEPRINT, TAG_CODE)
  }

  return texto
}

const parseNodeHtmlParaTexto = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node as Text).textContent || ''

  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const elemento = node as HTMLElement
    const tag = elemento.tagName.toLowerCase()
    let textoFormatado = ''

    switch (tag) {
      case 'strong':
        textoFormatado = `<strong>${Array.from(elemento.childNodes).map(parseNodeHtmlParaTexto).join('')}</strong>`
        break
      case 'em':
        textoFormatado = `<em>${Array.from(elemento.childNodes).map(parseNodeHtmlParaTexto).join('')}</em>`
        break
      case 'a':
        textoFormatado = `<a href="${elemento.getAttribute('href') || '#'}">${Array.from(elemento.childNodes).map(parseNodeHtmlParaTexto).join('')}</a>`
        break
      case 'br':
        textoFormatado = '<br>'
        break
      case 'code':
        textoFormatado = `<code>${Array.from(elemento.childNodes).map(parseNodeHtmlParaTexto).join('')}</code>`
        break
      default:
        textoFormatado = Array.from(elemento.childNodes).map(parseNodeHtmlParaTexto).join('')
        break
    }

    return textoFormatado
  }
  return ''
}

const parseHtmlToParagrafos = (paragrafoPrincipal: IParagrafo, nodes: NodeList) => {
  let paragrafoAtual: IParagrafo | null = null

  if (nodes) paragrafoPrincipal.componentes = []

  const criarParagrafo = (id: string, textoFormatado: string) => {
    if (paragrafoAtual) {
      paragrafoAtual.componentes!.push({
        id,
        tipoConteudo: 'paragrafo',
        nivel: 0,
        texto: textoFormatado
      } as IParagrafo)
    } else {
      paragrafoPrincipal.componentes!.push({
        id,
        tipoConteudo: 'paragrafo',
        nivel: 0,
        texto: textoFormatado
      } as IParagrafo)
    }
  }

  const criarTitulo = (id: string, elemento: HTMLElement) => {
    paragrafoAtual = {
      id,
      tipoConteudo: 'paragrafo',
      nivel: 3,
      titulo: elemento.textContent || '',
      texto: '',
      componentes: []
    }
  }

  nodes.forEach((node, indice) => {
  
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elemento = node as HTMLElement
      const tag = elemento.tagName.toLowerCase()
      const id = appUtils.gerarId()

      if(elemento.id === paragrafoPrincipal.id) {
        const textoFormatado = Array.from(elemento.childNodes).map(parseNodeHtmlParaTexto).join('')
       
        // if( elemento.textContent?.includes(paragrafoPrincipal.texto) || textoFormatado?.includes(paragrafoPrincipal.texto)){
          if(indice === 0) {paragrafoPrincipal.texto = textoFormatado} else {
            criarParagrafo(id, textoFormatado)
          }
   
        return

      }
      
      if (tag === 'h3') {
        if (paragrafoAtual) {
          paragrafoPrincipal.componentes!.push(paragrafoAtual)
        }
        criarTitulo(id, elemento)
      } else if (elemento.textContent && elemento.childNodes.length > 0) {
        const textoFormatado = Array.from(elemento.childNodes).map(parseNodeHtmlParaTexto).join('')
        criarParagrafo(id, textoFormatado)
      } else if (elemento.lastChild?.nodeName.toLowerCase() === 'br') {
        criarParagrafo(id, '')
      }
    }
  })

  if (paragrafoAtual) {
    paragrafoPrincipal.componentes!.push(paragrafoAtual)
  }
}

const toHtml = (paragrafo: IParagrafo) => {
  let html = ''

  if (paragrafo.tipoConteudo === 'paragrafo') {
    paragrafo.texto = parseFormatacaoBlueprintParaHtml(paragrafo.texto)

    if (!paragrafo.id) paragrafo.id = appUtils.gerarId()

    if (paragrafo.nivel === 0) {
      if (paragrafo.texto) {
        html += `<p id=${paragrafo.id}>${paragrafo.texto}</p>`
      } else {
        html += `<p id=${paragrafo.id}></br></p>`
      }
    } else if (paragrafo.nivel === 3 || paragrafo.nivel === 4) {
      html += `<h${paragrafo.nivel} id=${paragrafo.id}>${paragrafo.titulo}</h${paragrafo.nivel}>`
      html += paragrafo.texto || ''
    }

    return parseParagrafosFilhos(html, paragrafo.componentes)
  }

  return ''
}

const fromHtml = (paragrafoPrincipal: IParagrafo, html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  parseHtmlToParagrafos(paragrafoPrincipal, doc.body.childNodes)
}

export const paragrafoParser = {
  toHtml,
  fromHtml
}
