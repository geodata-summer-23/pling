import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export type Language = 'norsk' | 'english'

export const useUserStore = defineStore('user', {
  state: () => ({
    guid: null as null | string,
    signedInToArcGis: false,
    firstName: null as null | string,
    middleName: null as null | string,
    lastName: null as null | string,
    age: null as null | number,
    birthday: null as null | Date,
    language: 'english' as Language,
  }),

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
    loadFromLocalStorage() {
      this.guid = localStorage.getItem('guid') ?? null
      this.firstName = localStorage.getItem('firstName') ?? null
      this.lastName = localStorage.getItem('lastName') ?? null
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
    console.log('User is not already signed in.')
  })

export const signIn = () => {
  esriId.getCredential(oAuthInfo.portalUrl + '/sharing')
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
