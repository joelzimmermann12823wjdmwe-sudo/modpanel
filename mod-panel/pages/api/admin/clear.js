import { run } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' })
  }

  try {
    console.log('🗑️ Lösche alle Daten...');
    
    // Alle Einträge aus der Tabelle löschen
    const result = await run('DELETE FROM mod_actions');
    
    console.log('✅ Datenbank geleert. Gelöschte Einträge:', result.changes);
    
    res.status(200).json({ 
      message: 'Datenbank erfolgreich geleert',
      deletedEntries: result.changes
    });
    
  } catch (error) {
    console.error('❌ Fehler beim Löschen der Daten:', error);
    res.status(500).json({ 
      error: 'Fehler beim Löschen der Daten',
      details: error.message 
    });
  }
}
