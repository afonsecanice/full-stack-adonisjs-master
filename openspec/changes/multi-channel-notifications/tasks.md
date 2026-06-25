## 1. Setup & Dependencies

- [ ] 1.1 Install `@adonisjs/mail` package (`npm install @adonisjs/mail`)
- [ ] 1.2 Generate mail config via `node ace configure @adonisjs/mail` or create `backend/config/mail.ts` manually
- [ ] 1.3 Add mail driver environment variables to `.env` (MAIL_DRIVER, MAIL_HOST, MAIL_PORT, etc.)
- [ ] 1.4 Create `backend/app/services/` directory structure if it doesn't exist

## 2. Core Types & Interfaces

- [ ] 2.1 Create `backend/app/services/notifications/types.ts` with `Notification` type (to: User, subject, body, htmlBody?)
- [ ] 2.2 Create `backend/app/services/notifications/channel.ts` with `NotificationChannel` interface (send method)
- [ ] 2.3 Add subpath import alias `#services/*` to `tsconfig.json` if not already present

## 3. Email Channel Implementation

- [ ] 3.1 Create `backend/app/services/notifications/channels/email_channel.ts` implementing `NotificationChannel`
- [ ] 3.2 Implement `send()` method using AdonisJS `@adonisjs/mail` service
- [ ] 3.3 Add null/undefined email validation (skip silently if `notification.to.email` is missing)
- [ ] 3.4 Add error logging when email sending fails

## 4. Notification Service (Orchestrator)

- [ ] 4.1 Create `backend/app/services/notifications/notification_service.ts` with `NotificationService` class
- [ ] 4.2 Accept array of channels in constructor
- [ ] 4.3 Implement fan-out `send(notification: Notification): Promise<void>` using `Promise.allSettled()`
- [ ] 4.4 Log errors from individual channels without blocking others

## 5. IoC Container Registration

- [ ] 5.1 Create `backend/providers/notification_provider.ts` or register in `backend/start/app.ts`
- [ ] 5.2 Register `NotificationService` as singleton in AdonisJS container
- [ ] 5.3 Inject configured `EmailChannel` into `NotificationService`

## 6. Testing

- [ ] 6.1 Create `backend/tests/functional/notifications/notification_service.spec.ts`
- [ ] 6.2 Test successful email send scenario
- [ ] 6.3 Test partial failure (one channel fails, others succeed)
- [ ] 6.4 Test missing email address (skip gracefully)
- [ ] 6.5 Test empty channel array (no-op)
- [ ] 6.6 Use `db.beginGlobalTransaction()` / rollback pattern for test isolation
- [ ] 6.7 Mock mail service or use fake driver for testing

## 7. Verification & Documentation

- [ ] 7.1 Run `npm run typecheck` — no TypeScript errors
- [ ] 7.2 Run `npm run test` — all tests pass
- [ ] 7.3 Run `npm run lint` — no ESLint warnings
- [ ] 7.4 Test manual invocation via AdonisJS REPL (`node ace repl`)
- [ ] 7.5 Verify mail config loads from `.env` with no errors
