import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    signedIn: false,
    name: null as null | string,
    firstName: null as null | string,
    middleName: null as null | string,
    lastName: null as null | string,
    age: null as null | number,
  }),

  actions: {
    setName(name: string) {
      if (name.length == 0) return
      this.name = name
      this.saveToLocalStorage()
    },
    setFirstName(name: string) {
      if (name.length == 0) return
      this.firstName = name
      localStorage.setItem('firstName', this.firstName)
    },
    setMiddleName(name: string) {
      if (name.length == 0) return
      this.middleName = name
      localStorage.setItem('middelName', this.middleName)
    },
    setLastName(name: string) {
      if (name.length == 0) return
      this.lastName = name
      localStorage.setItem('lastName', this.lastName)
    },
    setAge(age: number) {
      if (age < 1) return
      this.age = age
      this.saveToLocalStorage()
    },
    loadFromLocalStorage() {
      this.name = localStorage.getItem('name') ?? null
      const age = localStorage.getItem('age')
      if (age) {
        this.age = parseInt(age)
      }
    },
    saveToLocalStorage() {
      if (this.name) {
        localStorage.setItem('name', this.name)
      }
      if (this.firstName) {
        localStorage.setItem('firstName', this.firstName)
      }
      if (this.middleName) {
        localStorage.setItem('middelName', this.middleName)
      }
      if (this.lastName) {
        localStorage.setItem('lastName', this.lastName)
      }
      if (this.age) {
        localStorage.setItem('age', this.age.toFixed(0))
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
    useUserStore().signedIn = true
  })
  .catch(() => {
    console.log('User is not already signed in.')
  })

export const signIn = () => {
  esriId.getCredential(oAuthInfo.portalUrl + '/sharing')
}
