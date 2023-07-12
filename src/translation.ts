import { useUserStore } from './stores/userStore'

export type Language = 'norwegian' | 'english'

export const $t = () => {
  return useUserStore().language == 'english' ? english : norwegian
}

type WordKey = keyof ReturnType<typeof $t>

export const translate = (text: string) => {
  const t = $t()
  return text
    .split(' ')
    .map((word) => (word in t ? t[word as WordKey] : '?'))
    .join(' ')
}

const norwegian = {
  continue: 'Gå videre',
  skip: 'Hopp over',
  add: 'Legg til',
  edit: 'Rediger',
  myLocation: 'Min Lokasjon',
  myPlaces: 'Mine steder',
  userInformation: 'Brukerinformasjon',
  signedInArcGis: 'Du er innlogget med ArcGIS.',
  notSignedIn: 'Du er ikke innlogget i ArcGIS.',
  addPlace: 'Legg til et sted',
  editPlace: 'Rediger et sted',
  cancelEdit: 'Avbryt redigering',
  save: 'Lagre',
  city: 'Poststed',
  street: 'Gate',
  name: 'Navn',
  requestHelp: 'Be om hjelp',
  serverError: 'Serverfeil',
  layers: 'Lag',
  signIn: 'Logg inn',
  delete: 'Slett',
  whatsYourBirthdate: 'Når er du født?',
  selectLanguage: 'Velg et språk',
  tellUsAboutYou: 'Fortell oss litt om deg',
  welcomeTo: 'Velkommen til',
  appName: 'Varslingstjenesten',
  editInformation: 'Rediger informasjon',
  clearAllData: 'Fjern all informasjon',
  report: 'Varsle',
  reportAnEvent: 'Varsle en hendelse',
  whatKindEvent: 'Hvilken type hendelse gjelder det?',
  whereEvent: 'Hvor skjer dette?',
  describeEvent: 'Forklar situasjonen',
  pictureEvent: 'Legg til et bilde',
  flood: 'Flom',
  torrentialRain: 'Styrtregn',
  fire: 'Brann',
  windDamage: 'Skade fra vind',
  avalanche: 'Skred',
  heatWave: 'Hetebølge',
  other: 'Annet',
  eventDescriptionText: 'Er det noe mer du vil informere om?',
  addPictureDescription:
    'Bildet blir brukt for å dokumentere hendelsen og kan bli delt offentlig.',
  overview: 'Se over og legg ut',
  publish: 'Legg ut',
  searchAddress: 'Søk etter en adresse..',
  selectInMap: 'Velg i kart',
  events: 'Hendelser',
  eventsDescription: 'Dette er hendelser som kan påvirke deg',
  wishToReport: 'Ønsker du å varsle en hendelse?',
  reportInfo:
    'Alle varslinger blir sendt til en server for å bli behandlet og deretter sendt ut til nettverket knyttet lokasjonen hvor hendelsen fant sted. Vær dermed obs på at varslene er offentlige.',
  thisPlace: 'dette stedet',
  notImplemented: 'Denne funksjonen er foreløpig ikke implementert.',
  takePicture: 'Ta et bilde',
  notify: 'Varsle',
  category: 'Kategori',
} as const

const english: Record<string, string> = {
  continue: 'Continue',
  skip: 'Skip',
  add: 'Add',
  edit: 'Edit',
  myLocation: 'My Location',
  myPlaces: 'My Places',
  userInformation: 'User Information',
  signedInArcGis: 'You are signed in with ArcGIS.',
  notSignedIn: 'You are not signed in to ArcGIS.',
  addPlace: 'Add a place',
  editPlace: 'Edit a place',
  cancelEdit: 'Cancel edit',
  save: 'Save',
  city: 'City',
  street: 'Street',
  name: 'Name',
  requestHelp: 'Request help',
  serverError: 'Server Error',
  layers: 'Layers',
  signIn: 'Sign In',
  delete: 'Delete',
  whatsYourBirthdate: "What's your birthdate?",
  selectLanguage: 'Select a language',
  tellUsAboutYou: 'Tell us a bit about yourself',
  welcomeTo: 'Welcome to',
  appName: 'Varslingstjenesten',
  editInformation: 'Edit information',
  clearAllData: 'Clear all data',
  report: 'Report',
  reportAnEvent: 'Report an event',
  whatKindEvent: 'What type of event is it?',
  whereEvent: 'Where is it?',
  describeEvent: 'Describe the situation',
  pictureEvent: 'Add a picture',
  flood: 'Flood',
  torrentialRain: 'Torrential rain',
  fire: 'Fire',
  windDamage: 'Wind damage',
  avalanche: 'Avalanche/landslide',
  heatWave: 'Heat wave',
  other: 'Other',
  eventDescriptionText:
    'Is there anything else you would like to inform about?',
  addPictureDescription:
    'The image is used to document the incident and may be shared to other users.',
  overview: 'Summary',
  publish: 'Publish',
  searchAddress: 'Search for an address..',
  selectInMap: 'Select in map',
  events: 'Events',
  eventsDescription: 'These are events that can affect you',
  wishToReport: 'Do you want to report an event?',
  reportInfo:
    'All notifications are sent to a server to be processed and then sent out to the network associated with the location where the event took place. Please note that the notifications are public.',
  thisPlace: 'this place',
  notImplemented: 'This function is currently not implemented.',
  takePicture: 'Take a picture',
  notify: 'Notify',
  category: 'Category',
} as const
