import { createClient } from '@vercel/kv'
import 'server-only' 
import { revalidatePath } from 'next/cache'

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
    return actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("KV getAllActions Error:", error);
    return [];
  }
}

/**
 * Speichert eine neue Aktion in Vercel KV (Server Action).
 */
export async function saveAction(newAction) {
  'use server'

  try {
    const actions = await getAllActions();
    
    const newId = actions.length > 0 ? (Math.max(...actions.map(a => parseInt(a.id || 0))) + 1).toString() : '1'

    const actionWithMeta = {
      ...newAction,
      id: newId,
      timestamp: new Date().toISOString(),
    }

    actions.unshift(actionWithMeta) 
    
    await kv.set(KV_KEY, actions)
    
    // Aktualisiert die Server Components auf dem Dashboard und der Logs-Seite
    revalidatePath('/') 
    revalidatePath('/logs')
    
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
