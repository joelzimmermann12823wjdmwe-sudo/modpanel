import { query, run, getBerlinTimestamp } from '../../../lib/database'

export default async function handler(req, res) {
  console.log('🌐 API Call:', req.method, req.body);
  console.log('🕒 Berliner Zeit:', getBerlinTimestamp());

  // CORS headers setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('📥 GET Aktionen angefragt');
      
      // Aktionen aus der Datenbank laden
      const actions = await query(`
        SELECT * FROM mod_actions 
        ORDER BY created_at DESC 
        LIMIT 100
      `);
      
      console.log('📤 Sende Aktionen:', actions.length);
      res.status(200).json(actions);
      
    } catch (error) {
      console.error('❌ Fehler beim Laden der Aktionen:', error);
      res.status(500).json({ 
        error: 'Fehler beim Laden der Aktionen',
        details: error.message 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { username, actionType, reason, notes, moderator = 'Admin' } = req.body;
      
      console.log('📝 Neue Aktion empfangen:', { username, actionType, reason, notes, moderator });
      
      // Validierung
      if (!username || !actionType || !reason) {
        console.log('❌ Fehlende Daten:', { username, actionType, reason });
        return res.status(400).json({ 
          error: 'Benutzername, Aktionstyp und Grund sind erforderlich' 
        });
      }

      // Aktion in die Datenbank einfügen
      const result = await run(
        `INSERT INTO mod_actions (username, action_type, reason, notes, moderator) 
         VALUES (?, ?, ?, ?, ?)`,
        [username, actionType, reason, notes || '', moderator]
      );

      console.log('✅ Aktion gespeichert mit ID:', result.id);

      res.status(201).json({ 
        id: result.id,
        message: 'Aktion erfolgreich gespeichert',
        timestamp: getBerlinTimestamp()
      });
      
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Aktion:', error);
      res.status(500).json({ 
        error: 'Fehler beim Speichern der Aktion',
        details: error.message 
      });
    }
  } else {
    console.log('❌ Unerlaubte Methode:', req.method);
    res.status(405).json({ error: 'Methode nicht erlaubt' });
  }
}
