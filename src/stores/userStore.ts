import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export const useUserStore = defineStore('user', {
  state: () => ({
    guid: null as null | string,
    signedInToArcGis: false,
    name: null as null | string,
    firstName: null as null | string,
    middleName: null as null | string,
    lastName: null as null | string,
    age: null as null | number,
    birthday: null as null | Date,
  }),

  actions: {
    setGuid() {
      if (this.guid) return
      this.guid = nanoid()
      localStorage.setItem('guid', this.guid)
    },
    setName(name: string) {
      this.name = name
      localStorage.setItem('name', this.name)
    },
    setFirstName(name: string) {
      this.firstName = name
      localStorage.setItem('firstName', this.firstName)
    },
    setMiddleName(name: string) {
      this.middleName = name
      localStorage.setItem('middleName', this.middleName)
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
    setAge(age: number) {
      if (age < 1) return
      this.age = age
      localStorage.setItem('age', this.age.toFixed(0))
    },
    loadFromLocalStorage() {
      this.name = localStorage.getItem('name') ?? null
      this.guid = localStorage.getItem('guid') ?? null
      const age = localStorage.getItem('age')
      if (age) {
        this.age = parseInt(age)
      }
      this.firstName = localStorage.getItem('fistName') ?? null
      this.middleName = localStorage.getItem('middleName') ?? null
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
