import log from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import type { NotificationChannel } from '../channel.js'
import type { Notification } from '../types.js'

export class EmailChannel implements NotificationChannel {
  async send(notification: Notification): Promise<void> {
    const { to, subject, body, htmlBody } = notification

    if (!to.email) {
      log.warn(`EmailChannel: Skipping notification - recipient has no email address`)
      return
    }

    try {
      await mail.send((message) => {
        message.to(to.email!).subject(subject).text(body)

        if (htmlBody) {
          message.html(htmlBody)
        }
      })
    } catch (error) {
      log.error(
        `EmailChannel: Failed to send email to ${to.email}. Error: ${error instanceof Error ? error.message : String(error)}`
      )
      throw error
    }
  }
}
