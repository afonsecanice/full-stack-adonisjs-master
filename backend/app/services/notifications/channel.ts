import type { Notification } from './types.js'

export interface NotificationChannel {
  send(notification: Notification): Promise<void>
}
