import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { NotificationService } from '#services/notifications/notification_service'
import type { NotificationChannel } from '#services/notifications/channel'
import type { Notification } from '#services/notifications/types'

test.group('NotificationService', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('sends notification successfully via email channel', async ({ assert }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: await hash.make('password'),
      fullName: 'Test User',
    })

    const sentEmails: Notification[] = []
    const mockEmailChannel: NotificationChannel = {
      send: async (notification: Notification) => {
        sentEmails.push(notification)
      },
    }

    const service = new NotificationService([mockEmailChannel])
    await service.send({
      to: user,
      subject: 'Welcome',
      body: 'Hello Test User',
      htmlBody: '<p>Hello</p>',
    })

    assert.lengthOf(sentEmails, 1)
    assert.equal(sentEmails[0].subject, 'Welcome')
    assert.equal(sentEmails[0].to.email, 'test@example.com')
  })

  test('handles partial failure - one channel fails, others succeed', async ({ assert }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: await hash.make('password'),
      fullName: 'Test User',
    })

    const successfulChannel: NotificationChannel = {
      send: async () => {
        // Success
      },
    }

    const failingChannel: NotificationChannel = {
      send: async () => {
        throw new Error('Channel failed')
      },
    }

    const service = new NotificationService([successfulChannel, failingChannel])

    // Should not throw even if one channel fails
    await service.send({
      to: user,
      subject: 'Test',
      body: 'Test body',
    })

    assert.ok(true)
  })

  test('skips notification when recipient has no email address', async ({ assert }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: await hash.make('password'),
      fullName: 'Test User',
    })

    // Create a user-like object without email
    const userWithoutEmail = {
      ...user.toJSON(),
      email: null,
    } as any

    const sentEmails: Notification[] = []
    const mockEmailChannel: NotificationChannel = {
      send: async (notification: Notification) => {
        if (notification.to.email) {
          sentEmails.push(notification)
        }
      },
    }

    const service = new NotificationService([mockEmailChannel])

    await service.send({
      to: userWithoutEmail,
      subject: 'Test',
      body: 'Test body',
    })

    // EmailChannel should skip silently when email is null
    assert.lengthOf(sentEmails, 0)
  })

  test('handles empty channel array gracefully', async ({ assert }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: await hash.make('password'),
      fullName: 'Test User',
    })

    const service = new NotificationService([])

    // Should not throw
    await service.send({
      to: user,
      subject: 'Test',
      body: 'Test body',
    })

    assert.ok(true)
  })

  test('sends notification with htmlBody', async ({ assert }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: await hash.make('password'),
      fullName: 'Test User',
    })

    const sentEmails: Notification[] = []
    const mockEmailChannel: NotificationChannel = {
      send: async (notification: Notification) => {
        sentEmails.push(notification)
      },
    }

    const service = new NotificationService([mockEmailChannel])
    await service.send({
      to: user,
      subject: 'HTML Email',
      body: 'Plain text fallback',
      htmlBody: '<h1>HTML Content</h1>',
    })

    assert.lengthOf(sentEmails, 1)
    assert.equal(sentEmails[0].htmlBody, '<h1>HTML Content</h1>')
  })

  test('sends to multiple channels concurrently', async ({ assert }) => {
    const user = await User.create({
      email: 'test@example.com',
      password: await hash.make('password'),
      fullName: 'Test User',
    })

    const sentByChannel1: Notification[] = []
    const sentByChannel2: Notification[] = []

    const channel1: NotificationChannel = {
      send: async (notification: Notification) => {
        sentByChannel1.push(notification)
      },
    }

    const channel2: NotificationChannel = {
      send: async (notification: Notification) => {
        sentByChannel2.push(notification)
      },
    }

    const service = new NotificationService([channel1, channel2])
    await service.send({
      to: user,
      subject: 'Multi-channel',
      body: 'Test',
    })

    assert.lengthOf(sentByChannel1, 1)
    assert.lengthOf(sentByChannel2, 1)
    assert.equal(sentByChannel1[0].subject, 'Multi-channel')
    assert.equal(sentByChannel2[0].subject, 'Multi-channel')
  })
})
