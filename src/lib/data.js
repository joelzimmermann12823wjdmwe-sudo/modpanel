import { createClient } from '@vercel/kv';
import 'server-only';

// Prüft, ob die permanenten KV-Variablen vorhanden sind
const isVercelKvAvailable = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

let kv;

if (isVercelKvAvailable) {
    // **DAUERHAFTE SPEICHERUNG:** Nutze Vercel KV
    kv = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });
} else {
    // **TEMPORÄRE SPEICHERUNG (NOTFALL):** In-Memory-Speicher
    console.error("SCHWERER FEHLER: KV-Variablen fehlen. Daten sind nur temporär!");
    
    // Simuliere ein KV-Client-Objekt
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
