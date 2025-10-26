export function formatDate(date) {
  return new Date(date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}
