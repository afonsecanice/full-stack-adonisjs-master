import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'

test.group('GET /api/v1/users/active', (group) => {
  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('returns 401 without auth token', async ({ client }) => {
    const response = await client.get('/api/v1/users/active')
    response.assertStatus(401)
  })

  test('returns empty array when no users active in last 24h', async ({ client, assert }) => {
    const requester = await User.create({
      email: 'requester@test.com',
      password: await hash.make('secret1234'),
      fullName: 'Requester',
      lastSeenAt: DateTime.now().minus({ hours: 25 }),
    })
    await User.create({
      email: 'old@test.com',
      password: await hash.make('secret1234'),
      fullName: 'Old User',
      lastSeenAt: DateTime.now().minus({ hours: 25 }),
    })

    const token = await User.accessTokens.create(requester)
    const response = await client
      .get('/api/v1/users/active')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    assert.isEmpty(response.body().users)
  })

  test('returns only users seen within last 24h', async ({ client, assert }) => {
    const now = DateTime.now()

    const requester = await User.create({
      email: 'requester@test.com',
      password: await hash.make('secret1234'),
      fullName: 'Requester',
      lastSeenAt: now.minus({ minutes: 10 }),
    })
    await User.create({
      email: 'recent1@test.com',
      password: await hash.make('secret1234'),
      fullName: 'Recent One',
      lastSeenAt: now.minus({ hours: 12 }),
    })
    await User.create({
      email: 'recent2@test.com',
      password: await hash.make('secret1234'),
      fullName: 'Recent Two',
      lastSeenAt: now.minus({ hours: 23 }),
    })
    await User.create({
      email: 'inactive@test.com',
      password: await hash.make('secret1234'),
      fullName: 'Inactive',
      lastSeenAt: now.minus({ hours: 48 }),
    })

    const token = await User.accessTokens.create(requester)
    const response = await client
      .get('/api/v1/users/active')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    const { users } = response.body()
    assert.lengthOf(users, 3)
    assert.notIncludeDeepMembers(users, [{ email: 'inactive@test.com' }])
  })
})
