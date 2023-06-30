import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    apiKey: import.meta.env.VUE_APP_ARCGIS_API_KEY ?? '',
    signedIn: false,
  }),
})
