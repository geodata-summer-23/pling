import { acceptHMRUpdate, defineStore } from 'pinia'
import { Category } from './placeStore'

export type NotificationData = {
  title: string
  body: string
  category: Category
  timeout?: number
  timestamp: number
  click: () => void
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    permission: Notification.permission ?? 'default',
    notifications: [] as NotificationData[],
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
    push(notification: NotificationData) {
      this.notifications.push(notification)

      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(notification.title, {
          body: notification.body,
          silent: false,
          vibrate: [300, 100, 400],
        })
      })
    },
    delete(notification: NotificationData) {
      const index = this.notifications.indexOf(notification)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
