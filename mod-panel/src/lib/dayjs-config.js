import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/de' // Importiere deutsches Locale

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('de') // Setze deutsches Locale global

// Konfiguriere die Standard-Zeitzone
const TIMEZONE = 'Europe/Berlin'

/**
 * Formatiert einen ISO-Zeitstempel in deutsches Datums- und Zeitformat (Berliner Zeit).
 * @param {string} isoTimestamp - Der ISO-Zeitstempel aus der Datenbank.
 * @returns {string} Das formatierte Datum (z.B. "26.10.2025, 18:00 Uhr")
 */
export const formatDateTime = (isoTimestamp) => {
  return dayjs(isoTimestamp)
    .tz(TIMEZONE)
    .format('DD.MM.YYYY, HH:mm [Uhr]')
}

/**
 * Gibt eine relative Zeitangabe in Deutsch zurück (z.B. "Vor 5 Minuten").
 * @param {string} isoTimestamp - Der ISO-Zeitstempel aus der Datenbank.
 * @returns {string} Die relative Zeitangabe.
 */
export const formatRelativeTime = (isoTimestamp) => {
  return dayjs(isoTimestamp).tz(TIMEZONE).fromNow()
}
