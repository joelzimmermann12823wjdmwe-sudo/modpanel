import { createClient } from '@vercel/kv';

// Überprüfe, ob die notwendigen Variablen für Vercel KV existieren
const isVercelKvAvailable = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

let kv;

if (isVercelKvAvailable) {
    // 1. **PRODUKTIONSLÖSUNG:** Nutze Vercel KV (Persistent)
    kv = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });
} else {
    // 2. **NOTFALL-LÖSUNG (Im Code):** Nutze einen In-Memory-Speicher (Nicht Persistent!)
    // Der Build wird jetzt nicht mehr wegen fehlender Variablen abbrechen.
    console.error("SCHWERER FEHLER: KV-Variablen fehlen. Verwende temporären In-Memory-Speicher!");
    
    // Simuliere ein KV-Client-Objekt mit grundlegenden Methoden
    const mockStore = {};
    
    kv = {
        // Simuliere hset (Speichern)
        hset: async (key, field, value) => {
            if (!mockStore[key]) mockStore[key] = {};
            mockStore[key][field] = value;
            return 1;
        },
        // Simuliere hgetall (Abrufen aller Daten)
        hgetall: async (key) => {
            // Gib einen Dummy-Eintrag aus, falls keine Daten vorhanden sind
            if (key === 'actions') {
                 return mockStore[key] || {
                    'dummy': {
                        id: 'dummy',
                        type: 'WARN',
                        player: 'Fehler: KV Variablen fehlen!',
                        reason: 'Bitte Umgebungsvariablen manuell in Vercel setzen!',
                        mod: 'SYSTEM-FAILBACK',
                        timestamp: Date.now()
                    }
                };
            }
            return mockStore[key] || null;
        },
        // Simuliere zrange, get, etc. (falls in Ihrem Code verwendet)
        zrange: async () => [], 
        get: async () => null,
    };
}

export { kv };
