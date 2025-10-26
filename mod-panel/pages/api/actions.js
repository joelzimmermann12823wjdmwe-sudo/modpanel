import { getAllActions, saveAction } from '../../src/lib/data'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // LOGIK: NEUE AKTION SPEICHERN
    try {
      const { username, actionType, reason, notes, moderator } = req.body
      
      if (!username || !actionType || !reason || !moderator) {
        return res.status(400).json({ message: 'Fehlende Felder: username, actionType, reason und moderator sind erforderlich.' })
      }
      
      const newAction = {
        username,
        actionType,
        reason,
        notes: notes || '',
        moderator,
      }
      
      const savedAction = await saveAction(newAction)
      
      // 201 Created
      res.status(201).json(savedAction)
      
    } catch (error) {
      console.error('Fehler beim Speichern der Aktion:', error)
      res.status(500).json({ message: 'Interner Serverfehler beim Speichern.' })
    }
  } else if (req.method === 'GET') {
    // LOGIK: ALLE AKTIONEN ABRUFEN
    try {
      const actions = await getAllActions()
      res.status(200).json(actions)
    } catch (error) {
      console.error('Fehler beim Abrufen der Aktionen:', error)
      res.status(500).json({ message: 'Interner Serverfehler beim Abrufen.' })
    }
  } else {
    // Methode nicht erlaubt
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Methode ${req.method} nicht erlaubt`)
  }
}
