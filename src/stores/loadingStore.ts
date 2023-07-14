import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    mapIsLoading: false,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoadingStore, import.meta.hot))
}
