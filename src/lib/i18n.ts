export type Lang = 'en' | 'hr'

export type Translations = {
  save: string
  cancel: string
  nameUpdated: string
  nameFailed: string
  signOut: string
  property: string
  accessControl: string
  navigation: string
  calendar: string
  myStays: string
  adminPanel: string
  admin: string
  yourStays: string
  othersStays: string
  selectedRange: string
  yourDays: string
  othersDays: string
  clickHint: string
  bookedInPeriod: string
  notesOptional: string
  bookStay: string
  booking: string
  nights: (n: number) => string
  clear: string
  remove: string
  occupied: string
  you: string
  ownConflict: string
  othersConflict: string
  stayBooked: string
  stayRemoved: string
  bookFailed: string
  removeFailed: string
  selectRange: string
  adminView: string
  upcomingStays: string
  pastStays: string
  noUpcoming: string
  noPast: string
  noStaysYet: string
  noStaysHint: string
  active: string
  accessLogs: string
  users: string
  user: string
  type: string
  from: string
  to: string
  all: string
  entry: string
  exit: string
  exportCSV: string
  records: (n: number) => string
  name: string
  dateTime: string
  noResults: string
  previous: string
  next: string
  roleFailed: string
  roleUpdated: string
  months: string[]
  days: string[]
  locale: string
}

export const en: Translations = {
  save: 'Save',
  cancel: 'Cancel',
  nameUpdated: 'Name updated',
  nameFailed: 'Failed to update name',
  signOut: 'Sign out',
  property: 'Property',
  accessControl: 'Access Control',
  navigation: 'Navigation',
  calendar: 'Calendar',
  myStays: 'My Stays',
  adminPanel: 'Admin Panel',
  admin: 'Admin',
  yourStays: 'Your stays',
  othersStays: "Others' stays",
  selectedRange: 'Selected range',
  yourDays: 'Your days',
  othersDays: "Others' days",
  clickHint: 'Click a day · Click again to set a range · Then book your stay',
  bookedInPeriod: 'Booked in this period',
  notesOptional: 'Notes (optional)',
  bookStay: 'Book Stay',
  booking: 'Booking...',
  nights: (n) => n === 1 ? '1 night' : `${n} nights`,
  clear: 'Clear ✕',
  remove: 'Remove',
  occupied: 'Occupied',
  you: 'You',
  ownConflict: 'You already have a stay in this period. Remove it first to rebook.',
  othersConflict: 'These dates are already booked by another user.',
  stayBooked: 'Stay booked:',
  stayRemoved: 'Stay removed',
  bookFailed: 'Failed to book. Try again.',
  removeFailed: 'Failed to remove stay.',
  selectRange: 'Select a range on the calendar to book a stay',
  adminView: 'Admin view — all bookings visible',
  upcomingStays: 'Upcoming stays',
  pastStays: 'Past stays',
  noUpcoming: 'No upcoming stays',
  noPast: 'No past stays',
  noStaysYet: 'No stays booked yet',
  noStaysHint: 'Go to the Calendar tab and select a date range to book your first stay',
  active: 'Active',
  accessLogs: 'Access Logs',
  users: 'Users',
  user: 'User',
  type: 'Type',
  from: 'From',
  to: 'To',
  all: 'All',
  entry: 'Entry',
  exit: 'Exit',
  exportCSV: 'Export CSV',
  records: (n) => `${n} record${n !== 1 ? 's' : ''}`,
  name: 'Name',
  dateTime: 'Date & Time',
  noResults: 'No results',
  previous: '← Previous',
  next: 'Next →',
  roleFailed: 'Failed to update role',
  roleUpdated: 'Role updated',
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  locale: 'en-US',
}

export const hr: Translations = {
  save: 'Spremi',
  cancel: 'Odustani',
  nameUpdated: 'Ime ažurirano',
  nameFailed: 'Ažuriranje imena neuspješno',
  signOut: 'Odjava',
  property: 'Imanje',
  accessControl: 'Kontrola pristupa',
  navigation: 'Navigacija',
  calendar: 'Kalendar',
  myStays: 'Moji boravci',
  adminPanel: 'Admin panel',
  admin: 'Admin',
  yourStays: 'Vaši boravci',
  othersStays: 'Boravci ostalih',
  selectedRange: 'Odabrani period',
  yourDays: 'Vaši dani',
  othersDays: 'Dani ostalih',
  clickHint: 'Kliknite dan · Ponovo za period · Rezervirajte',
  bookedInPeriod: 'Rezervirano u ovom periodu',
  notesOptional: 'Napomene (opcionalno)',
  bookStay: 'Rezerviraj',
  booking: 'Rezerviranje...',
  nights: (n) => n === 1 ? '1 noć' : `${n} noći`,
  clear: 'Poništi ✕',
  remove: 'Ukloni',
  occupied: 'Zauzeto',
  you: 'Vi',
  ownConflict: 'Već imate boravak u ovom periodu. Uklonite ga i rezervirajte ponovo.',
  othersConflict: 'Ove datume je rezervirao drugi korisnik.',
  stayBooked: 'Boravak rezerviran:',
  stayRemoved: 'Boravak uklonjen',
  bookFailed: 'Rezervacija neuspješna. Pokušajte ponovo.',
  removeFailed: 'Uklanjanje neuspješno.',
  selectRange: 'Odaberite period na kalendaru za rezervaciju',
  adminView: 'Admin pregled — sve rezervacije vidljive',
  upcomingStays: 'Nadolazeći boravci',
  pastStays: 'Prošli boravci',
  noUpcoming: 'Nema nadolazećih boravaka',
  noPast: 'Nema prošlih boravaka',
  noStaysYet: 'Još nema rezervacija',
  noStaysHint: 'Idite na Kalendar i odaberite period za prvu rezervaciju',
  active: 'Aktivno',
  accessLogs: 'Zapisi pristupa',
  users: 'Korisnici',
  user: 'Korisnik',
  type: 'Tip',
  from: 'Od',
  to: 'Do',
  all: 'Sve',
  entry: 'Ulaz',
  exit: 'Izlaz',
  exportCSV: 'Preuzmi CSV',
  records: (n) => `${n} zapis${n === 1 ? '' : 'a'}`,
  name: 'Ime',
  dateTime: 'Datum i vrijeme',
  noResults: 'Nema rezultata',
  previous: '← Prethodno',
  next: 'Sljedeće →',
  roleFailed: 'Ažuriranje uloge neuspješno',
  roleUpdated: 'Uloga ažurirana',
  months: ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'],
  days: ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'],
  locale: 'hr-HR',
}

export const translations: Record<Lang, Translations> = { en, hr }
