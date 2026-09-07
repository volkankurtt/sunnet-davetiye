/**
 * Sünnet davetiyesi metin ve etkinlik bilgileri.
 * Bileşenlere ad, tarih veya mekan yazmayın; burayı güncelleyin.
 */
export const eventConfig = {
  childName: 'Mustafa Atlas Sölüm',
  eventDate: '11 Eylül 2026',
  countdownTarget: '2026-09-11',
  /** UI’da gösterilmez. Countdown hedef saati için geçici değer. */
  eventTime: '12:00',
  timezone: 'Europe/Istanbul',
  venueName: 'Köşdere Aktivite Merkezi',
  venueAddress: 'Sakarya Mah. 320. Sokak No: 29, Köşdere Aktivite Merkezi',
  venueShort: 'Köşdere',
  mapsQuery: 'Sakarya Mah. 320. Sokak No: 29, Köşdere Aktivite Merkezi',
  invitationTitle: 'Sünnet Davetimize Bekliyoruz',
  invitationMessage: 'Bu özel günümüzde sizleri de aramızda görmekten mutluluk duyarız.',
  pageTitle: 'Mustafa Atlas Sölüm — Sünnet Davetiyesi',
  downloadFilePrefix: 'mustafa-atlas-solum',
  galleryTitle: "Mustafa Atlas Sölüm'ün Anı Galerisi",
  galleryLead: 'Bu özel günden paylaşılan kareleri burada görebilirsiniz.',
  galleryEmpty: 'Henüz fotoğraf yüklenmedi. İlk anıyı siz paylaşın.',
  memoriesEmpty: 'Henüz anı bırakılmadı. İlk güzel mesajı siz yazın.',
  memoryLead: 'Fotoğraflar günü gösterir, yazdıklarınız o günü hatırlatır.',
  heroImage: {
    src: '/images/hero.jpeg',
    desktopPosition: 'center 42%',
    mobilePosition: 'center 38%',
  },
  introVideoSrc: '/videos/intro.mp4',
} as const
