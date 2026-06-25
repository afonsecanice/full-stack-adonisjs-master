# Multi-Channel Notifications

## Purpose

Abstraction for sending notifications through multiple delivery channels (email, SMS, push, etc.) without coupling business logic to specific delivery mechanisms.

## Requirements

### Requirement: Notification type definition

The system SHALL define a `Notification` type with the following fields:
- `to: User` — the recipient user object
- `subject: string` — email subject line
- `body: string` — plain text body
- `htmlBody?: string` — optional HTML body (for rich formatting)

#### Scenario: Create a valid notification

- **WHEN** calling `NotificationService.send()` with `{ to: user, subject: 'Welcome', body: 'Hello', htmlBody: '<p>Hello</p>' }`
- **THEN** the notification is accepted and routed to all active channels

#### Scenario: Send text-only notification

- **WHEN** calling `NotificationService.send()` with `{ to: user, subject: 'Alert', body: 'Action required' }` (no htmlBody)
- **THEN** the notification is sent with plaintext body and htmlBody defaults to undefined

### Requirement: NotificationChannel interface

The system SHALL define a `NotificationChannel` interface with a single async method `send(notification: Notification): Promise<void>`. Each channel implementation MUST fulfill this contract.

#### Scenario: Channel sends notification successfully

- **WHEN** a channel's `send()` method is called with a valid notification
- **THEN** the method completes without throwing and returns a resolved Promise

#### Scenario: Channel handles errors gracefully

- **WHEN** a channel encounters a transient error (network timeout, service unavailable)
- **THEN** the channel throws an error which is caught by the orchestrator and logged; other channels continue

### Requirement: NotificationService fan-out behavior

The system SHALL accept an array of `NotificationChannel` implementations and send each notification to all channels simultaneously (fan-out strategy). If one channel fails, other channels MUST still be attempted.

#### Scenario: Send to multiple channels

- **WHEN** `NotificationService` is initialized with `[EmailChannel, SMSChannel]` and `send()` is called
- **THEN** both channels receive the notification concurrently; failures in one channel do not block others

#### Scenario: Handle partial failure

- **WHEN** EmailChannel succeeds and SMSChannel throws an error during `send()`
- **THEN** the email is sent, the error is logged, and the promise resolves with logging of the failure

#### Scenario: Send when no channels are active

- **WHEN** `NotificationService` is initialized with an empty channel array and `send()` is called
- **THEN** the method completes with a log warning (no-op send)

### Requirement: Service registration in IoC container

The system SHALL register `NotificationService` as a singleton in AdonisJS's IoC container so that it can be injected into controllers and other services via the `app.container.make()` API.

#### Scenario: Inject service into controller

- **WHEN** a controller requests `NotificationService` via `app.container.make('NotificationService')`
- **THEN** a singleton instance is returned with all configured channels

#### Scenario: Service persists across requests

- **WHEN** `NotificationService` is accessed in two consecutive requests
- **THEN** the same singleton instance is returned (channels and configuration persist)
