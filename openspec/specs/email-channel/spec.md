# Email Channel

## Purpose

Email delivery implementation of the NotificationChannel interface using AdonisJS mail service with support for SMTP and SendGrid drivers.

## Requirements

### Requirement: EmailChannel implementation

The system SHALL provide an `EmailChannel` class that implements the `NotificationChannel` interface. It MUST use AdonisJS's `@adonisjs/mail` service for sending emails with configurable drivers (SMTP, SendGrid).

#### Scenario: Send email via SMTP driver

- **WHEN** `EmailChannel.send()` is called with a notification and SMTP is configured
- **THEN** the mail service sends the email via SMTP with the notification's subject, body, and htmlBody

#### Scenario: Send email via SendGrid driver

- **WHEN** `EmailChannel.send()` is called with a notification and SendGrid is configured
- **THEN** the mail service sends the email via SendGrid API with the notification's subject, body, and htmlBody

#### Scenario: Skip email when recipient has no email address

- **WHEN** `EmailChannel.send()` is called with a notification where `notification.to.email` is null/undefined
- **THEN** the method completes without sending and logs a warning

#### Scenario: Throw error on mail service failure

- **WHEN** the mail service encounters an error (SMTP connection failure, invalid credentials, SendGrid API error)
- **THEN** `EmailChannel` propagates the error as a thrown Promise rejection; the orchestrator catches and logs it

### Requirement: Mail configuration

The system SHALL read mail driver configuration from AdonisJS's `config/mail.ts`. The configuration MUST support:
- Driver selection: `MAIL_DRIVER` environment variable (default: `smtp`)
- SMTP settings: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- SendGrid settings: `SENDGRID_API_KEY`
- Sender address: `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`

#### Scenario: Load SMTP configuration from environment

- **WHEN** the application starts with `MAIL_DRIVER=smtp` and SMTP credentials in `.env`
- **THEN** `config/mail.ts` parses the configuration and mail service is ready for SMTP delivery

#### Scenario: Load SendGrid configuration from environment

- **WHEN** the application starts with `MAIL_DRIVER=sendgrid` and `SENDGRID_API_KEY` in `.env`
- **THEN** `config/mail.ts` parses the configuration and mail service is ready for SendGrid delivery

### Requirement: Email content formatting

`EmailChannel` MUST use the notification's `subject`, `body`, and optional `htmlBody` to construct the email.

#### Scenario: Send plaintext email

- **WHEN** a notification has `subject: 'Welcome'`, `body: 'Hello user'`, and no htmlBody
- **THEN** the email is sent with plaintext content

#### Scenario: Send HTML-formatted email

- **WHEN** a notification has `subject: 'Welcome'`, `body: 'Hello user'`, and `htmlBody: '<h1>Hello</h1>'`
- **THEN** the email is sent with both plaintext and HTML parts (multipart alternative)

#### Scenario: Set sender address

- **WHEN** `EmailChannel.send()` is called
- **THEN** the email is sent from the address configured in `MAIL_FROM_ADDRESS` / `MAIL_FROM_NAME`

### Requirement: Error logging

`EmailChannel` MUST log errors when email sending fails, including the error message and the recipient email address (for debugging).

#### Scenario: Log SMTP connection error

- **WHEN** the mail service throws a connection error
- **THEN** the error and recipient email are logged for troubleshooting
