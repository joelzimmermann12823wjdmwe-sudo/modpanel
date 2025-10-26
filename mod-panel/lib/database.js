const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'modpanel.db');

// Datenbankverbindung erstellen
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Fehler beim Öffnen der Datenbank:', err.message);
  } else {
    console.log('✅ Verbunden mit SQLite Datenbank:', dbPath);
    initializeDatabase();
  }
});

// Berliner Zeit-Funktion
function getBerlinTimestamp() {
  return new Date().toLocaleString('de-DE', { 
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Datenbank initialisieren
function initializeDatabase() {
  db.serialize(() => {
    // Tabelle für Mod-Actions erstellen
    db.run(`CREATE TABLE IF NOT EXISTS mod_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      action_type TEXT NOT NULL,
      reason TEXT NOT NULL,
      notes TEXT,
      moderator TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('❌ Fehler beim Erstellen der Tabelle:', err.message);
      } else {
        console.log('✅ Mod-Actions Tabelle bereit');
        console.log('🕒 Zeitzone: Europe/Berlin');
      }
    });
  });
}

// Funktion zum Ausführen von SELECT Queries
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    console.log('🔍 SQL Query:', sql, params);
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('❌ Query Fehler:', err.message);
        reject(err);
      } else {
        console.log('📊 Query Ergebnis:', rows.length, 'Zeilen');
        resolve(rows);
      }
    });
  });
}

// Funktion zum Ausführen von INSERT/UPDATE/DELETE Queries
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    console.log('🚀 SQL Run:', sql, params);
    console.log('🕒 Berliner Zeit:', getBerlinTimestamp());
    
    db.run(sql, params, function(err) {
      if (err) {
        console.error('❌ Run Fehler:', err.message);
        reject(err);
      } else {
        console.log('✅ Run erfolgreich. ID:', this.lastID, 'Changes:', this.changes);
        resolve({ 
          id: this.lastID, 
          changes: this.changes 
        });
      }
    });
  });
}

// Datenbank schließen (für Cleanup)
function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('❌ Fehler beim Schließen der Datenbank:', err.message);
        reject(err);
      } else {
        console.log('🔒 Datenbankverbindung geschlossen');
        resolve();
      }
    });
  });
}

module.exports = {
  db,
  query,
  run,
  close,
  getBerlinTimestamp
};
