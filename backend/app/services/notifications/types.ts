import type User from '#models/user'

export interface Notification {
  to: User
  subject: string
  body: string
  htmlBody?: string
}
