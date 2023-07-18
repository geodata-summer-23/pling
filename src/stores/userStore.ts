import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { $t, Language } from '@/translation'
import { usePlaceStore } from './placeStore'

export type UserData = {
  guid: string
  signedInToArcGis: boolean
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  age: number | null
  birthday: Date | null
  language: Language
}

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      guid: '',
      signedInToArcGis: false as boolean,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      age: null as null | number,
      birthday: null as null | Date,
      language: 'norwegian' as Language,
    } satisfies UserData),

  actions: {
    setGuid() {
      if (this.guid) return
      this.guid = nanoid()
      localStorage.setItem('guid', this.guid)
    },
    setFirstName(name: string) {
      this.firstName = name
      localStorage.setItem('firstName', this.firstName)
    },
    setLastName(name: string) {
      this.lastName = name
      localStorage.setItem('lastName', this.lastName)
    },
    setBirthday(date: Date | null) {
      if (date === null) return
      this.birthday = date
      localStorage.setItem('birthday', this.birthday.toISOString())
    },
    setEmail(email: string) {
      this.email = email
      localStorage.setItem('email', this.email)
    },
    setPhoneNumber(phoneNumber: string) {
      this.phoneNumber = phoneNumber
      localStorage.setItem('phoneNumber', this.phoneNumber)
    },
    setLanguage(language: Language) {
      this.language = language
      localStorage.setItem('language', this.language)
      usePlaceStore().places[0].nickname = $t().myLocation
    },
    loadFromLocalStorage() {
      this.guid = localStorage.getItem('guid') ?? ''
      this.firstName = localStorage.getItem('firstName') ?? ''
      this.lastName = localStorage.getItem('lastName') ?? ''
      this.email = localStorage.getItem('email') ?? ''
      this.phoneNumber = localStorage.getItem('phoneNumber') ?? ''
      this.language =
        (localStorage.getItem('language') as Language) ?? 'norwegian'
      const date = localStorage.getItem('birthday')
      if (date) {
        this.birthday = new Date(date)
      }
    },
  },
})

// ArcGIS Auth

export const oAuthInfo = new OAuthInfo({
  appId: 'A0NwPKkEBxfkEBvQ',
})
esriId.registerOAuthInfos([oAuthInfo])

esriId
  .checkSignInStatus(oAuthInfo.portalUrl + '/sharing')
  .then(() => {
    useUserStore().signedInToArcGis = true
  })
  .catch(() => {
    signIn()
  })

export const signIn = () => {
  esriId.getCredential(oAuthInfo.portalUrl + '/sharing')
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
