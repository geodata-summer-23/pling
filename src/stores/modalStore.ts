import { acceptHMRUpdate, defineStore } from 'pinia'
import { markRaw } from 'vue'

type Emits = Record<string, (...args: any[]) => any>

export const useModalStore = defineStore('modal', {
  state: () => ({
    components: [] as { component: any; props: object; emits: Emits }[],
  }),

  actions: {
    push(component: any, props: object, emits: Emits) {
      this.components.push({
        component: markRaw(component),
        props: props,
        emits: emits,
      })
    },
    pop() {
      this.components.pop()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModalStore, import.meta.hot))
}
