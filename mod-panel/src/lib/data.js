import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'src', 'data', 'data.json')

// Stellt sicher, dass der Datenordner existiert
if (!fs.existsSync(path.dirname(dataPath))) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true })
}

/**
 * Liest alle Aktionen aus der data.json-Datei.
 * @returns {Array} Liste der Moderationsaktionen.
 */
export async function getAllActions() {
  if (!fs.existsSync(dataPath)) {
    return []
  }
  try {
    const data = await fs.promises.readFile(dataPath, 'utf-8')
    return JSON.parse(data).mod_actions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  } catch (error) {
    // Wenn die Datei korrupt oder leer ist, gib ein leeres Array zurück
    return []
  }
}

/**
 * Speichert eine neue Aktion in die data.json-Datei.
 * @param {object} newAction - Die neue Moderationsaktion.
 * @returns {object} Die gespeicherte Aktion mit ID und Zeitstempel.
 */
export async function saveAction(newAction) {
  const actions = await getAllActions()
  
  // Generiere eine neue ID (größte ID + 1)
  const newId = actions.length > 0 ? (Math.max(...actions.map(a => parseInt(a.id))) + 1).toString() : '1'

  // Füge benötigte Metadaten hinzu
  const actionWithMeta = {
    ...newAction,
    id: newId,
    timestamp: new Date().toISOString(),
  }

  actions.unshift(actionWithMeta) // Füge die neue Aktion oben ein (neueste zuerst)

  const dataToWrite = JSON.stringify({ mod_actions: actions }, null, 2)
  await fs.promises.writeFile(dataPath, dataToWrite, 'utf-8')

  return actionWithMeta
}

/**
 * Ruft eine einzelne Aktion anhand ihrer ID ab.
 * @param {string} id - Die ID der Aktion.
 * @returns {object|null} Die Aktion oder null, wenn nicht gefunden.
 */
export async function getActionById(id) {
  const actions = await getAllActions()
  return actions.find(action => action.id === id) || null
}
