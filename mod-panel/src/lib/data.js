import { createClient } from '@vercel/kv'
import 'server-only' // Stellt sicher, dass dieses Modul nur auf dem Server läuft

// Initialisiere Vercel KV Client
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KV_KEY = 'mod_actions';

/**
 * Ruft alle Aktionen ab und sortiert sie nach Zeitstempel.
 * @returns {Promise<Array>} Liste der Moderationsaktionen.
 */
export async function getAllActions() {
  try {
    const data = await kv.get(KV_KEY);
    const actions = Array.isArray(data) ? data : [];
    // Sortiere nach Zeitstempel absteigend (neueste zuerst)
    return actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("KV getAllActions Error:", error);
    return [];
  }
}

/**
 * Speichert eine neue Aktion in Vercel KV.
 * Nutzt Server Actions für die Mutation.
 * @param {object} newAction - Die neue Moderationsaktion.
 * @returns {Promise<object>} Die gespeicherte Aktion mit ID und Zeitstempel.
 */
export async function saveAction(newAction) {
  'use server'

  try {
    const actions = await getAllActions();
    
    // Generiere eine neue ID (größte ID + 1)
    const newId = actions.length > 0 ? (Math.max(...actions.map(a => parseInt(a.id || 0))) + 1).toString() : '1'

    const actionWithMeta = {
      ...newAction,
      id: newId,
      timestamp: new Date().toISOString(),
    }

    // Füge die neue Aktion am Anfang ein
    actions.unshift(actionWithMeta) 
    
    // Speichere die gesamte Liste zurück in KV
    await kv.set(KV_KEY, actions)
    
    // Wir müssen revalidatePath aufrufen, um die Server Components zu aktualisieren
    // import { revalidatePath } from 'next/cache' muss in der Datei sein, die aufgerufen wird
    // Dies wird in der ActionForm übernommen
    
    return { success: true, action: actionWithMeta };
  } catch (error) {
    console.error("KV saveAction Error:", error);
    return { success: false, error: 'Speichern fehlgeschlagen.' };
  }
}

/**
 * Ruft eine einzelne Aktion anhand ihrer ID ab.
 * @param {string} id - Die ID der Aktion.
 * @returns {Promise<object|null>} Die Aktion oder null, wenn nicht gefunden.
 */
export async function getActionById(id) {
  const actions = await getAllActions()
  return actions.find(action => action.id === id) || null
}
