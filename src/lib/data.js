import { createClient } from '@vercel/kv'
import 'server-only' 
import { revalidatePath } from 'next/cache'

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KV_KEY = 'mod_actions';

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
    
    revalidatePath('/') 
    revalidatePath('/logs')
    
    return { success: true, action: actionWithMeta };
  } catch (error) {
    console.error("KV saveAction Error:", error);
    return { success: false, error: 'Speichern fehlgeschlagen.' };
  }
}

export async function getActionById(id) {
  const actions = await getAllActions()
  return actions.find(action => action.id === id) || null
}
