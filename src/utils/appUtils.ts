const gerarId = (): string => {
  return `${Date.now() + Math.floor(Math.random() * 1000)}`
}

const inputQuillToolbarOptions = [
  [{ header: [3, false] }],
  ['bold', 'italic'],
  ['link', 'code'],
  [{ list: 'ordered' }, { list: 'bullet' }]
]

export const appUtils = {
  gerarId,
  inputQuillToolbarOptions
}
