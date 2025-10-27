import { MongoClient } from 'mongodb';
import 'server-only';

// Verbindungs-URI aus Vercel Umgebungsvariablen (MONGODB_URI)
const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (uri) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
} else {
    // Gibt einen Fehler aus, wenn die URI nicht gesetzt ist, um den Build zu unterbrechen.
    clientPromise = Promise.reject(new Error("FEHLER: MONGODB_URI fehlt. Daten können NICHT gespeichert werden."));
}

/**
 * Speichert eine Mod-Aktion in der MongoDB-Kollektion 'actions'.
 * @param {object} actionData - Daten der Aktion
 */
export async function saveAction(actionData) {
    try {
        const client = await clientPromise;
        // Nutzt den Datenbanknamen, der im URI-String (z.B. /modpanelDB) angegeben ist.
        const db = client.db(client.options.dbName || "modpanelDB"); 
        const collection = db.collection("actions");

        // Fügt das Dokument ein. MongoDB fügt automatisch eine _id hinzu.
        await collection.insertOne(actionData);
        return true;
    } catch (error) {
        console.error("MongoDB-Fehler beim Speichern:", error);
        return false;
    }
}

/**
 * Ruft alle Mod-Aktionen ab und konvertiert sie in das Key-Value-Objekt.
 */
export async function getAllActions() {
    try {
        const client = await clientPromise;
        const db = client.db(client.options.dbName || "modpanelDB");
        const collection = db.collection("actions");

        // Ruft alle Dokumente ab und sortiert sie nach dem neuesten Zeitstempel
        const actionsArray = await collection.find({})
            .sort({ timestamp: -1 })
            .toArray();

        // Konvertiert das Array in das Key-Value-Objekt-Format, das das Frontend erwartet
        const result = {};
        actionsArray.forEach(action => {
            result[action.id] = action;
        });

        return result;

    } catch (error) {
        console.error("MongoDB-Fehler beim Abrufen:", error);
        // Fallback-Meldung für den Frontend-Fehlerzustand
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
