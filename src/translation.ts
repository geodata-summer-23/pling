import { useUserStore } from './stores/userStore'

export type Language = 'norwegian' | 'english'

export const $t = () => {
  return useUserStore().language == 'english' ? english : norwegian
}

const norwegian = {
  continue: 'Gå videre',
  skip: 'Hopp over',
  add: 'Legg til',
  myLocation: 'Min Lokasjon',
  myPlaces: 'Mine steder',
  userInformation: 'Brukerinformasjon',
  signedInArcGis: 'Du er innlogget med ArcGIS.',
  notSignedIn: 'Du er ikke innlogget i ArcGIS.',
  addPlace: 'Legg til et sted',
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
}

const english = {
  continue: 'Continue',
  skip: 'Skip',
  add: 'Add',
  myLocation: 'My Location',
  myPlaces: 'My Places',
  userInformation: 'User Information',
  signedInArcGis: 'You are signed in with ArcGIS.',
  notSignedIn: 'You are not signed in to ArcGIS.',
  addPlace: 'Add a place',
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
}
