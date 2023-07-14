import { acceptHMRUpdate, defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    permission: Notification.permission ?? 'default',
  }),
  actions: {
    init() {
      navigator.serviceWorker.register('sw.js')
      this.requestPermission()
    },
    requestPermission() {
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
      } else if (Notification.permission === 'granted') {
        this.permission = Notification.permission
      } else if (Notification.permission !== 'denied') {
        alert('Trying to request permission')
        Notification.requestPermission().then((p) => {
          this.permission = p
          if (this.permission === 'granted') {
          } else {
            alert(`Permission was not granted. It was ${this.permission}`)
          }
        })
      }
      this.permission = Notification.permission
    },
    notify(text: string) {
      if (this.permission != 'granted') {
        // TODO:
        return
      }

      navigator.serviceWorker.ready.then((registration) => {
        console.log(text)
        registration.showNotification(text, {
          body: text,
          silent: false,
          vibrate: [300, 100, 400],
        })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
