import { API_BASE_URL } from './constants'

export async function createModAction(actionData) {
  const response = await fetch(`${API_BASE_URL}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(actionData),
  })
  
  if (!response.ok) {
    throw new Error('Fehler beim Erstellen der Aktion')
  }
  
  return response.json()
}

export async function getModActions(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString()
  const response = await fetch(`${API_BASE_URL}/actions?${queryParams}`)
  
  if (!response.ok) {
    throw new Error('Fehler beim Laden der Aktionen')
  }
  
  return response.json()
}
