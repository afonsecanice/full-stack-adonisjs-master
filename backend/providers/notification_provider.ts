import type { ApplicationService } from '@adonisjs/core/types'
import { EmailChannel } from '#services/notifications/channels/email_channel'
import { NotificationService } from '#services/notifications/notification_service'

export default class NotificationProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(NotificationService, () => {
      const emailChannel = new EmailChannel()
      return new NotificationService([emailChannel])
    })
  }

  async boot() {
    // Booted when the application is ready
  }

  async start() {
    // Started when the server is ready
  }

  async shutdown() {
    // Cleanup when application is shutting down
  }
}
