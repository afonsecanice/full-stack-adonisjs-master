## Why

The application currently has no notification system. Users need a way to be notified of important events (account activity, password resets, transaction confirmations, etc.). A multi-channel architecture allows notifications to be sent via multiple channels (email, SMS, push, webhooks) without coupling the business logic to a specific delivery mechanism, making the system extensible for future channels.

## What Changes

- Add `backend/app/services/notifications/` directory with abstractions for notification channels and a service orchestrator
- Create `NotificationChannel` interface defining the contract for all notification channels
- Create `NotificationService` that accepts multiple channels and sends to all active channels for a user (fan-out strategy)
- Implement `EmailChannel` using AdonisJS's `@adonisjs/mail` with SMTP and SendGrid driver support
- Add `Notification` type with fields: `to` (User), `subject`, `body`, `htmlBody` (optional)
- Register the service in AdonisJS's IoC container for dependency injection
- Add integration tests covering successful delivery, skipped channels, and error handling

## Capabilities

### New Capabilities
- `multi-channel-notifications`: Core abstraction for sending notifications through multiple channels using fan-out strategy
- `email-channel`: Email delivery channel using AdonisJS mail service with SMTP/SendGrid support

### Modified Capabilities

<!-- None -->

## Impact

**Code:**
- New: `backend/app/services/notifications/` (types, interfaces, implementations)
- New: `backend/config/mail.ts` (mail configuration)
- New: `backend/tests/functional/notifications/` (integration tests)
- Affected: `.env` (mail driver configuration)

**APIs:**
- None exposed at this stage (service for internal use)

**Dependencies:**
- New: `@adonisjs/mail` (for email delivery)

**Systems:**
- Mail service integration (SMTP or SendGrid depending on env)
