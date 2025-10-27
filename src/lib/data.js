import { MongoClient } from 'mongodb';
import 'server-only';

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (uri) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
} else {
    clientPromise = Promise.reject(new Error("FEHLER: MONGODB_URI fehlt. Daten können NICHT gespeichert werden."));
}

// Speichert eine Mod-Aktion
export async function saveAction(actionData) {
    try {
        const client = await clientPromise;
        const db = client.db(client.options.dbName || "modpanelDB"); 
        const collection = db.collection("actions");

        await collection.insertOne(actionData);
        return true;
    } catch (error) {
        console.error("MongoDB-Fehler beim Speichern:", error);
        return false;
    }
}

// Ruft alle Mod-Aktionen ab
export async function getAllActions() {
    try {
        const client = await clientPromise;
        const db = client.db(client.options.dbName || "modpanelDB");
        const collection = db.collection("actions");

        const actionsArray = await collection.find({})
            .sort({ timestamp: -1 })
            .toArray();

        const result = {};
        actionsArray.forEach(action => {
            result[action.id] = action;
        });

        return result;

    } catch (error) {
        console.error("MongoDB-Fehler beim Abrufen:", error);
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
