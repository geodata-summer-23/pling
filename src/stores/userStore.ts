import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'
import { defineStore } from 'pinia'

export const oAuthInfo = new OAuthInfo({
  appId: 'A0NwPKkEBxfkEBvQ',
})
esriId.registerOAuthInfos([oAuthInfo])

export const useUserStore = defineStore('user', {
  state: () => ({
    signedIn: false,
    oAuthInfo: null as OAuthInfo | null,
    addresses: [] as string[],
  }),

  actions: {},
})

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
