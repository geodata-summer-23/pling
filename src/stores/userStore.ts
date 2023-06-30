import { defineStore } from 'pinia'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'

const getOAuth = () => {
  const oAuthInfo = new OAuthInfo({
    appId: 'A0NwPKkEBxfkEBvQ',
  })

  esriId.registerOAuthInfos([oAuthInfo])

  esriId
    .checkSignInStatus(oAuthInfo.portalUrl + '/sharing')
    .then(() => {
      useUserStore().signedIn = true
    })
    .catch((e: Error) => {
      console.log(e)
      useUserStore().signedIn = false
    })
  return oAuthInfo
}

export const useUserStore = defineStore('user', {
  state: () => ({
    // apiKey: import.meta.env.VUE_APP_ARCGIS_API_KEY ?? '',
    signedIn: false,
    oAuthInfo: getOAuth(),
  }),
})
