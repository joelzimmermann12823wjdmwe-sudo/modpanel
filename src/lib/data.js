import { createClient } from '@supabase/supabase-js';
import 'server-only';

// Supabase Client für Server-Side-Aufrufe initialisieren
// Nutzt die Umgebungsvariablen NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY
// die Sie in Vercel gesetzt haben.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase;
let db;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }, // Wichtig für Server Actions
    });
    // Die 'actions' Tabelle muss in Supabase erstellt werden, falls sie noch nicht existiert.
    db = supabase.from('actions');
    console.log("Datenbank: Supabase (PostgreSQL) verwendet.");
} else {
    // NOTFALL-LÖSUNG: Kein Server-Side-Database-Client ohne Keys
    console.error("ACHTUNG: Supabase Keys fehlen! Daten können NICHT persistent gespeichert werden.");
    // Wir lassen 'db' hier undefined, und die Funktionen unten müssen das abfangen.
}


// Funktion zum Speichern einer Mod-Aktion in der Supabase-Datenbank
export async function saveAction(actionData) {
    if (!db) {
        console.warn("Speichern fehlgeschlagen: Supabase-Client nicht verfügbar.");
        return false;
    }
    
    // Einfügen des neuen Datensatzes in die 'actions' Tabelle
    const { data, error } = await db.insert([
        { 
            id: actionData.id,
            type: actionData.type,
            player: actionData.player,
            reason: actionData.reason,
            mod: actionData.mod,
            timestamp: actionData.timestamp,
        }
    ]).select();

    if (error) {
        console.error('Fehler beim Speichern in Supabase:', error);
        return false;
    }
    return true;
}

// Funktion zum Abrufen aller Mod-Aktionen
export async function getAllActions() {
    if (!db) {
        // Fallback für den Fall, dass die Keys fehlen
        return {
            'error-key': {
                id: 'error-key',
                type: 'ERROR',
                player: 'SUPABASE FEHLT!',
                reason: 'Bitte NEXT_PUBLIC_SUPABASE_URL/ANON_KEY in Vercel eintragen.',
                mod: 'SYSTEM',
                timestamp: Date.now()
            }
        };
    }

    const { data: actions, error } = await db.select('*').order('timestamp', { ascending: false });

    if (error) {
        console.error('Fehler beim Abrufen von Supabase:', error);
        return {};
    }

    // Wandelt das Array-Ergebnis in ein Key-Value-Objekt um (wie Redis es zuvor tat)
    const result = {};
    if (actions) {
        actions.forEach(action => {
            result[action.id] = action;
        });
    }
    return result;
}

// Exportieren Sie die Supabase-Client-Instanz, falls andere Dateien sie benötigen (optional)
export { supabase };
