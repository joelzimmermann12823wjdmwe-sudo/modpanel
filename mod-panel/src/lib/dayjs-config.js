import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/de' 

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('de') 

const TIMEZONE = 'Europe/Berlin'

export const formatDateTime = (isoTimestamp) => {
  return dayjs(isoTimestamp)
    .tz(TIMEZONE)
    .format('DD.MM.YYYY, HH:mm [Uhr]')
}

export const formatRelativeTime = (isoTimestamp) => {
  return dayjs(isoTimestamp).tz(TIMEZONE).fromNow()
}
