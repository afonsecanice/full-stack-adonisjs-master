import log from '@adonisjs/core/services/logger'
import type { NotificationChannel } from './channel.js'
import type { Notification } from './types.js'

export class NotificationService {
  constructor(private channels: NotificationChannel[]) {}

  async send(notification: Notification): Promise<void> {
    if (this.channels.length === 0) {
      log.warn('NotificationService: No channels configured')
      return
    }

    const results = await Promise.allSettled(
      this.channels.map((channel) => channel.send(notification))
    )

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        log.error(`NotificationService: Channel ${index} failed: ${result.reason}`)
      }
    })
  }
}
