import { MongoClient } from 'mongodb';
import 'server-only';

// Verbindungs-URI aus Vercel Umgebungsvariablen
// Die URI muss den Datenbanknamen enthalten: .../modpanelDB?retryWrites=...
const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (uri) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
} else {
    // Gibt einen Fehler aus, wenn die URI nicht gesetzt ist (wichtig für den Vercel-Build)
    clientPromise = Promise.reject(new Error("FEHLER: MONGODB_URI fehlt. Daten können NICHT gespeichert werden."));
}

// Funktion zum Speichern einer Mod-Aktion
export async function saveAction(actionData) {
    try {
        const client = await clientPromise;
        // Nutzt den Datenbanknamen aus dem URI (z.B. 'modpanelDB')
        const db = client.db(client.options.dbName || "modpanelDB"); 
        const collection = db.collection("actions");

        await collection.insertOne(actionData);
        return true;
    } catch (error) {
        console.error("MongoDB-Fehler beim Speichern:", error);
        return false;
    }
}

// Funktion zum Abrufen aller Mod-Aktionen
export async function getAllActions() {
    try {
        const client = await clientPromise;
        const db = client.db(client.options.dbName || "modpanelDB");
        const collection = db.collection("actions");

        // Ruft alle Dokumente ab und sortiert nach dem 'timestamp'
        const actionsArray = await collection.find({})
            .sort({ timestamp: -1 })
            .toArray();

        // Konvertiert das Array-Ergebnis in das Key-Value-Objekt-Format, das das Frontend erwartet
        const result = {};
        actionsArray.forEach(action => {
            result[action.id] = action;
        });

        return result;

    } catch (error) {
        console.error("MongoDB-Fehler beim Abrufen:", error);
        // Fallback-Meldung bei Datenbankfehler
        return {
            'error-key': {
                id: 'error-key',
                type: 'ERROR',
                player: 'MONGODB FEHLT!',
                reason: 'Datenbankverbindung fehlgeschlagen oder Sammlung nicht gefunden.',
                mod: 'SYSTEM',
                timestamp: Date.now()
            }
        };
    }
}

export { getAllActions, saveAction };
