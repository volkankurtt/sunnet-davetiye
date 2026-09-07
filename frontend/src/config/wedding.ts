import type { BackgroundImage, WeddingInfo } from '../types'
import { eventConfig } from './eventConfig'

export const backgroundImages: BackgroundImage[] = [
  {
    file: 'hero.jpeg',
    src: eventConfig.heroImage.src,
    desktopPosition: eventConfig.heroImage.desktopPosition,
    mobilePosition: eventConfig.heroImage.mobilePosition,
  },
]

export const wedding: WeddingInfo = {
  childName: eventConfig.childName,
  weddingDate: eventConfig.countdownTarget,
  weddingTime: eventConfig.eventTime,
  timezone: eventConfig.timezone,
  venueName: eventConfig.venueName,
  address: eventConfig.venueAddress,
  venueShort: eventConfig.venueShort,
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventConfig.mapsQuery)}`,
  pageTitle: eventConfig.pageTitle,
  downloadFilePrefix: eventConfig.downloadFilePrefix,
  invitationTitle: eventConfig.invitationTitle,
  invitationMessage: eventConfig.invitationMessage,
  eventDateLabel: eventConfig.eventDate,
  galleryTitle: eventConfig.galleryTitle,
  galleryLead: eventConfig.galleryLead,
  galleryEmpty: eventConfig.galleryEmpty,
  memoriesEmpty: eventConfig.memoriesEmpty,
  memoryLead: eventConfig.memoryLead,
}

export const coupleNames = wedding.childName

export function formatWeddingDate(style: 'numeric' | 'long' = 'numeric') {
  return new Intl.DateTimeFormat('tr-TR', {
    day: style === 'numeric' ? '2-digit' : 'numeric',
    month: style === 'numeric' ? '2-digit' : 'long',
    year: 'numeric',
    timeZone: wedding.timezone,
  }).format(new Date(`${wedding.weddingDate}T12:00:00+03:00`))
}

export { ACCEPT_ATTR, MEMORY_LIMITS, UPLOAD_LIMITS } from './limits'

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const

export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'] as const

export const MAX_FILE_SIZE_MB = 25
export const MAX_MEMORY_CHARS = 600
