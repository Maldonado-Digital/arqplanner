export function getInitials(name: string) {
  const splitted = name.trim().split(' ')
  if (!splitted.length || !splitted[0].length) return 'n/a'

  if (splitted.length === 1) {
    return `${splitted[0][0]}${splitted[0][1] ?? ''}`
  }

  return `${splitted[0][0]}${splitted[1][0] ?? ''}`
}

export function getFullName(name: string) {
  const splitted = name.trim().split(' ')
  if (!splitted.length || !splitted[0].length) return 'Nenhum \nnome'

  if (splitted.length === 1) {
    return splitted[0]
  }

  return splitted.slice(0, 2).join(' ')
}

export function phoneMask(value: string) {
  const match = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/)

  if (!match) return value

  return !match[2]
    ? match[1]
    : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`
}
