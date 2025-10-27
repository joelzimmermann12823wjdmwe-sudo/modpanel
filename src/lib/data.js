import { kv } from '@vercel/kv';
import 'server-only';

/**
 * Speichert eine Mod-Aktion in Vercel KV (Redis).
 * @param {object} actionData - Daten der Aktion
 */
export async function saveAction(actionData) {
  try {
    // Speichert das Aktionsobjekt als Hash-Feld unter dem Schlüssel 'actions'
    await kv.hset('actions', { [actionData.id]: actionData });
    return true;
  } catch (error) {
    console.error("KV-Fehler beim Speichern:", error);
    return false;
  }
}

/**
 * Ruft alle Mod-Aktionen ab.
 */
export async function getAllActions() {
  try {
    // Ruft alle gespeicherten Aktionen ab (Hash-Felder der Liste 'actions')
    const actions = await kv.hgetall('actions');
    return actions || {};

  } catch (error) {
    console.error("KV-Fehler beim Abrufen:", error);
    // Fallback-Meldung für den Frontend-Fehlerzustand
    return {
        'error-key': {
            id: 'error-key',
            type: 'ERROR',
            player: 'VERCEL KV FEHLT!',
            reason: 'Datenbankverbindung fehlgeschlagen oder Variable fehlt.',
            mod: 'SYSTEM',
            timestamp: Date.now()
        }
    };
  }
}

export { getAllActions, saveAction };
