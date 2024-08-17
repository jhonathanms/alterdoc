
let debounceTimeout: number

export const start = (funcao: () => void, tempoEspera: number) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  debounceTimeout = setTimeout(() => {
    funcao()
  }, tempoEspera)
}

export const debounce = {
    start
}