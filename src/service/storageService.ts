import packageJson from '../../package.json'

const PREFIXO = `${packageJson.name}_`

const storageService = {
  setItem(chave: string, valor: any) {
    const prefixedKey = PREFIXO + chave
    if (valor) {
      localStorage.setItem(prefixedKey, JSON.stringify(valor))
      return
    }
    this.remove(chave)
  },

  getItem(chave: string) {
    const prefixedKey = PREFIXO + chave
    const item = localStorage.getItem(prefixedKey)
    return item ? JSON.parse(item) : null
  },

  remove(chave: string) {
    const prefixedKey = PREFIXO + chave
    localStorage.removeItem(prefixedKey)
  },

  clear() {
    Object.keys(localStorage)
      .filter((chave) => chave.startsWith(PREFIXO))
      .forEach((chave) => localStorage.removeItem(chave))
  }
}

export default storageService
