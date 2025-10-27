import { createClient } from '@vercel/kv';
import 'server-only';

// Überprüfe, ob die notwendigen Variablen für Vercel KV existieren
const isVercelKvAvailable = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

let kv;

if (isVercelKvAvailable) {
    // 1. PRODUKTIONSLÖSUNG: Nutze Vercel KV (Persistent)
    kv = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });
} else {
    // 2. NOTFALL-LÖSUNG (In-Memory): Für lokale Tests oder Build-Fallback
    console.error("KV-Variablen fehlen. Verwende temporären In-Memory-Speicher!");
    
    // Simuliere ein KV-Client-Objekt mit grundlegenden Methoden
    const mockStore = {};
    
    kv = {
        hset: async (key, field, value) => {
            if (!mockStore[key]) mockStore[key] = {};
            mockStore[key][field] = value;
            return 1;
        },
        hgetall: async (key) => {
            if (key === 'actions') {
                 return mockStore[key] || {
                    'dummy': {
                        id: 'dummy',
                        type: 'INFO',
                        player: 'Fehler! KV-Verbindung fehlt',
                        reason: 'Bitte Umgebungsvariablen manuell in Vercel setzen!',
                        mod: 'SYSTEM-FALLBACK',
                        timestamp: Date.now()
                    }
                };
            }
            return mockStore[key] || null;
        },
        zrange: async () => [], 
        get: async () => null,
    };
}

export { kv };
