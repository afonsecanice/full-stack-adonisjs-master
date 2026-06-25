import env from '#start/env'
import { defineConfig } from '@adonisjs/mail'
import { transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  mailers: {
    smtp: transports.smtp({
      host: env.get('MAIL_HOST', 'localhost'),
      port: Number.parseInt(env.get('MAIL_PORT', '1025')),
      auth:
        env.get('MAIL_USERNAME') && env.get('MAIL_PASSWORD')
          ? {
              type: 'login',
              user: env.get('MAIL_USERNAME')!,
              pass: env.get('MAIL_PASSWORD')!,
            }
          : undefined,
    }),
  },

  from: {
    address: env.get('MAIL_FROM_ADDRESS', 'noreply@example.com'),
    name: env.get('MAIL_FROM_NAME', 'Notifications'),
  },
})

export default mailConfig
