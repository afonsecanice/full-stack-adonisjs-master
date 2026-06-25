## Context

The application has no notification system. Business logic needs to notify users asynchronously (account changes, password resets, etc.) through multiple channels without tight coupling to specific delivery mechanisms. The architecture must support easy addition of new channels in the future.

AdonisJS provides `@adonisjs/mail` for email delivery with multiple drivers (SMTP, SendGrid, etc.). The backend follows a service-oriented pattern with dependency injection via the IoC container.

## Goals / Non-Goals

**Goals:**
- Decouple business logic from notification delivery mechanisms
- Enable sending notifications through multiple channels simultaneously (fan-out)
- Support SMTP and SendGrid email drivers via AdonisJS mail service
- Make it easy to add new channels in the future (e.g., SMS, push, webhooks)
- Ensure notifications don't block main application flow (async-ready)
- Provide testable abstractions

**Non-Goals:**
- Implementing SMS, push, or webhook channels in this iteration (framework only)
- Message queuing / job persistence (handled by future integration with job queue)
- Retry logic (delegated to individual channel implementations)
- User preference management or opt-out UI (future enhancement)

## Decisions

**Decision 1: Abstract channel behavior via interface**
- Use TypeScript interface `NotificationChannel` with single method: `send(notification: Notification): Promise<void>`
- **Rationale**: Enables loose coupling; new channels can be added without modifying the orchestrator
- **Alternative**: Inheritance with abstract base class — less flexible for composition, harder to test
- **Alternative**: Duck typing without interface — loses type safety, harder to discover contract

**Decision 2: Fan-out orchestration strategy**
- `NotificationService` accepts array of channels and sends to all active ones simultaneously
- **Rationale**: Simple mental model; supports use cases like "email + SMS backup"; failures in one channel don't block others (Promise.allSettled)
- **Alternative**: Priority fallback (try email, then SMS if email fails) — doesn't fit requirement for simultaneous multi-channel
- **Alternative**: Per-event routing (different events use different channels) — added complexity; can be layered on top later

**Decision 3: Use AdonisJS mail service for email delivery**
- Leverage `@adonisjs/mail` with configurable driver (SMTP, SendGrid)
- **Rationale**: Aligns with AdonisJS ecosystem; driver support is free; configuration is centralized in `config/mail.ts`
- **Alternative**: Direct SMTP via nodemailer — loses AdonisJS ecosystem benefits, reinvents driver abstraction
- **Alternative**: Delegate to third-party email API client — unnecessary when AdonisJS already provides it

**Decision 4: Notification type includes `htmlBody` (optional)**
- `Notification` has `to`, `subject`, `body`, `htmlBody?: string`
- **Rationale**: HTML support is common for transactional email; optional field future-proofs for text-only channels
- **Alternative**: Separate `TextNotification` and `HtmlNotification` types — overcomplicates when optional field is simpler

**Decision 5: Service registered in IoC container for dependency injection**
- `NotificationService` instantiated once and registered with `@adonisjs/core` container
- **Rationale**: Follows AdonisJS conventions; makes service injectable in controllers and other services
- **Alternative**: Direct export and instantiation — works but loses DI benefits, harder to test/mock

## Risks / Trade-offs

**[Risk] Fan-out strategy can send duplicate notifications on channel failure**
→ **Mitigation**: Implement idempotency in business logic (e.g., send event ID with notification); use `Promise.allSettled` so one channel failure doesn't block others

**[Risk] Missing `@adonisjs/mail` dependency in environment**
→ **Mitigation**: Add dependency check in notification service; fail gracefully with logging if mail service unavailable

**[Risk] Email channels may not have user email address**
→ **Mitigation**: `EmailChannel` validates `notification.to.email` and skips silently if missing; tests cover this case

**[Trade-off] Synchronous send vs. job queue**
→ **Choice**: Initial implementation is synchronous (awaited). For heavy workloads, future enhancement can delegate to job queue without changing interface

## Open Questions

- Should channels support opt-out flags (e.g., user disabled email)? → Deferred to future preference management feature
- Should `NotificationService` persist notification history? → Deferred; current design is stateless
- How should errors in one channel be reported (logging vs. throwing)? → Use `Promise.allSettled` and log errors per channel
