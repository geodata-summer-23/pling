import { acceptHMRUpdate, defineStore } from 'pinia'
import { serverUrl } from '@/scripts/url'
import { Position } from '../scripts/place'
import { Category } from '@/scripts/category'

export type HelpRequest = {
  message: string
  position: Position
  timestamp: number
  dist: number
  category: Category
}

export const useHelpRequestStore = defineStore('helpRequest', {
  state: () => ({
    requests: [] as HelpRequest[],
  }),

  actions: {
    async updateRequests(position: Position) {
      if (!position?.latitude || !position?.longitude) return
      const response = await fetch(
        `${serverUrl}/help-requests?lat=${position.latitude}&lon=${position.longitude}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      this.requests = JSON.parse(await response.json())
    },
    requestHelp(helpRequest: Partial<HelpRequest>) {
      helpRequest.timestamp = Date.now()
      fetch(`${serverUrl}/help-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(helpRequest),
      })
    },
  },

  getters: {},
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHelpRequestStore, import.meta.hot))
}
