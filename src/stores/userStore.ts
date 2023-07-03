import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    signedIn: false,
    name: null as null | string,
    age: null as null | number,
  }),

  actions: {
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
