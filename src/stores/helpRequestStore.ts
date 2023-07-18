import { acceptHMRUpdate, defineStore } from 'pinia'
import { AddressPoint } from './placeStore'
import { serverUrl } from '@/constants'

export type HelpRequest = {
  message: string
  position: AddressPoint
  timestamp: number
  dist: number
}

export const useHelpRequestStore = defineStore('helpRequest', {
  state: () => ({
    requests: [] as HelpRequest[],
  }),

  actions: {
    async updateRequests(position: AddressPoint) {
      if (!position?.latitude || !position?.longitude) return
      const response = await fetch(
        `${serverUrl}/help-requests?lat=${position.latitude}&lon=${position.longitude}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      this.requests = JSON.parse(await response.json())
    },
  },

  getters: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHelpRequestStore, import.meta.hot))
}
