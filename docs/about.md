# QueueCare â€” Complete Project Overview & Development Specification

## 1. Project Identity

**Project Name:** QueueCare  
**Tagline:** Smarter clinic visits. Less waiting.  
**Project Type:** Smart clinic token booking and queue management web application  
**Target Users:** Patients, receptionists and clinic administrators  
**Primary Goal:** Reduce unnecessary waiting at a single clinic by allowing patients to book tokens remotely and view estimated waiting times while giving clinic staff a centralized system to manage the entire queue.

## 2. Project Background and Problem Statement

Traditional clinics commonly manage patient queues using paper tokens, phone calls and manual registers. Patients often need to travel to the clinic and wait for long periods without knowing when their turn will come.

The current process has several problems:

- Patients cannot easily see the current queue status.
- Patients may arrive too early and spend hours waiting.
- Receptionists must handle repeated calls about token numbers and waiting times.
- Online bookings, telephone bookings and walk-in patients can become difficult to coordinate.
- Patients may cancel, arrive late or fail to show up.
- Consultation durations vary, making fixed appointment times unreliable.
- Urgent cases can change the expected queue order.
- Manual records make it difficult to analyze waiting times and clinic performance.

QueueCare will digitize and streamline this process for one specific clinic.

## 3. Project Objectives

1. Allow patients to book clinic tokens online.
2. Provide phone-number OTP authentication without requiring email accounts.
3. Display the current serving token and public queue information.
4. Calculate realistic estimated waiting-time ranges and recommended arrival times.
5. Allow receptionists to manage online bookings, telephone bookings and walk-ins in one shared queue.
6. Support skipped, cancelled, completed and no-show tokens.
7. Allow authorized clinic staff to manage priority cases according to clinic policy.
8. Provide an administrative settings area for clinic timings, token limits and queue rules.
9. Maintain secure patient records and an audit trail of important queue changes.
10. Establish a foundation for future machine-learning-based waiting-time predictions.

## 4. Scope and Product Boundaries

QueueCare is designed for one particular clinic, not a hospital or multi-hospital management platform.

The initial version must include:

- Patient-facing website.
- Patient phone OTP authentication.
- Token booking and tracking.
- Receptionist dashboard.
- Admin settings and staff permissions.
- Shared online, telephone and walk-in queue.
- Queue status management.
- Waiting-time estimation.
- Supabase database integration.
- Deployment configuration for Vercel and Render.

Do not build unrelated hospital-management features such as pharmacy inventory, laboratory management, insurance claims, inpatient admission, electronic prescriptions or video consultations.

Do not make an external AI API a requirement for the initial version.

## 5. Technology Stack

Use the following architecture unless an existing repository requires a documented adjustment.

### Frontend
- React
- Vite
- TypeScript preferred for maintainability
- HTML and CSS
- A consistent component system
- Responsive, mobile-first design
- Accessible forms and keyboard navigation

### Backend
- Python
- FastAPI
- Pydantic request and response validation
- REST API with JSON
- SQLAlchemy or an equivalent maintainable database-access layer
- Database migrations, preferably Alembic

### Database and authentication
- Supabase PostgreSQL
- Supabase Auth for phone OTP authentication
- Supabase Row Level Security where applicable
- Supabase Realtime as an optional enhancement for queue updates

### Hosting
- Vercel for the frontend.
- Render Web Service for the Python backend.
- Supabase for PostgreSQL and authentication.

Use environment variables for all secrets and environment-specific configuration.

Do not expose Supabase service-role keys, database credentials, SMS-provider credentials or other private secrets in frontend code.

## 6. User Roles

### 6.1 Patient

Patients can:

- Verify their mobile number.
- View public clinic information.
- View the public queue status.
- Book a token.
- View their own bookings.
- Track their current token.
- View estimated waiting time and recommended arrival time.
- Cancel eligible bookings.
- View their booking history.
- Update permitted profile information.
- Sign out securely.

Patients cannot:

- Assign their own token number.
- Change their booking status to checked in, serving or completed.
- Skip other patients.
- Assign themselves emergency priority.
- Read other patients' private information.
- Access staff dashboards or administrative settings.

### 6.2 Receptionist

Receptionists can:

- Access the protected receptionist dashboard.
- View and manage the day's queue.
- Register walk-in patients.
- Register bookings received by phone.
- View online bookings.
- Search bookings using authorized search fields.
- Check patients in.
- Call the next eligible patient.
- Start and complete consultations.
- Mark patients as skipped.
- Reinstate skipped patients according to policy.
- Cancel or correct bookings with an appropriate reason.
- Handle authorized priority cases if their role permits it.
- View current session information and operational statistics.

Receptionists must not automatically have permission to change all clinic settings or manage other staff accounts.

### 6.3 Clinic Administrator

Administrators have receptionist capabilities plus:

- Configure clinic information.
- Configure operating hours and sessions.
- Configure token limits.
- Configure booking and cancellation rules.
- Configure arrival buffers and estimation settings.
- Create, invite or authorize staff accounts.
- Assign or revoke staff roles.
- Configure permitted priority-handling rules.
- View activity logs and operational reports.
- Manage session closures and exceptional situations.

No visitor may register themselves as an administrator. The initial administrator must be provisioned through a secure setup process.

## 7. Public Website and Patient Pages

### 7.1 Clinic homepage

Display:

- Clinic name and logo.
- Doctor's displayed name, where applicable.
- Clinic address and directions link.
- Contact number.
- Operating hours.
- Current open, closed, delayed or paused status.
- Current serving token.
- Number of patients currently ahead or other safe aggregate queue information.
- Book Token button.
- Track My Token button.
- Brief instructions explaining the booking process.
- A disclaimer that estimated times can change.

The clinic name, address, schedule and other information must come from configurable clinic settings rather than being hardcoded throughout the application.

### 7.2 Phone authentication

Build a phone-number authentication flow:

1. Enter the phone number with country code.
2. Request an OTP.
3. Enter and verify the OTP.
4. Create or retrieve the associated patient profile.
5. Maintain a secure authenticated session.
6. Provide logout and session-expiration handling.

Email login is not required.

Use Supabase Auth's supported phone authentication flow. Do not implement an insecure custom OTP system.

Development must support configured test phone numbers and test OTPs where available. Document that production SMS delivery requires a supported SMS provider and may incur costs. Do not claim real OTP delivery is free unless the configured provider actually offers it.

Include appropriate rate limiting, resend cooldowns, error handling and abuse prevention.

### 7.3 Token booking page

The booking page should:

- Show the clinic's booking availability.
- Allow selection of a date if advance booking is enabled.
- Allow selection of a clinic session if multiple sessions exist.
- Collect patient name and mobile number through the authenticated profile where appropriate.
- Collect only other information that the clinic genuinely needs.
- Allow general consultation or follow-up selection if enabled by the clinic.
- Display the applicable booking policy.
- Check availability on the backend.
- Prevent conflicting or duplicate bookings according to clinic policy.
- Confirm the booking only after the backend successfully creates it.

Never assign a final token number in frontend JavaScript.

### 7.4 Booking confirmation

After a successful booking, display:

- Booking reference.
- Assigned token number.
- Clinic date and session.
- Booking status.
- Current serving token.
- Estimated waiting-time range, if sufficient data is available.
- Recommended arrival time.
- Link to track the booking.

The confirmation must be based on the saved database record.

### 7.5 Patient dashboard

Display:

- Current and upcoming bookings.
- Token number.
- Current serving token.
- Number of eligible patients ahead.
- Estimated waiting-time range.
- Recommended arrival time.
- Booking status.
- Last updated time.
- Cancellation option when permitted.
- Booking history.

Update the dashboard automatically using polling initially or Supabase Realtime after secure access policies are configured.

If the estimate is unavailable or unreliable, display an appropriate message rather than inventing an exact time.

### 7.6 Public queue display

Provide a public, privacy-safe queue view that shows:

- Current serving token.
- Next eligible token where clinic policy permits.
- Aggregate number of patients waiting.
- Clinic session status.
- Estimated delays where appropriate.

Never publicly expose patient names, phone numbers, OTPs, appointment details or medical information.

## 8. Receptionist Dashboard

Create a separate, authenticated staff interface.

Suggested routes:

- `/staff/login`
- `/staff/dashboard`
- `/staff/queue`
- `/staff/bookings`
- `/staff/reports`
- `/staff/settings`

Routes are organizational suggestions; use a consistent router and role guards.

### 8.1 Dashboard overview

Display operational cards for:

- Current serving token.
- Next eligible token.
- Total bookings today.
- Patients waiting.
- Patients checked in.
- Active consultations.
- Completed consultations.
- Skipped and cancelled bookings.
- No-show counts.
- Average consultation duration.
- Estimated queue delay.
- Current clinic session and its status.

Statistics must be calculated from real database records, not hardcoded demo numbers in production.

### 8.2 Queue management

Provide a searchable and filterable queue table with:

- Token number.
- Patient name.
- Booking source.
- Session.
- Booking time.
- Check-in status.
- Queue status.
- Estimated waiting time where applicable.
- Permitted staff actions.

Actions should include:

- Check in.
- Call next.
- Start consultation.
- Complete consultation.
- Mark skipped.
- Reinstate a skipped patient according to policy.
- Cancel booking.
- Record a reason for manual changes.

Use confirmation dialogs for consequential actions. Disable invalid actions and handle stale data or conflicting updates gracefully.

### 8.3 Manual bookings

Receptionists must be able to register:

- Walk-in patients.
- Patients who booked over the telephone.
- Other clinic-approved manually registered bookings.

The form should collect the minimum necessary details and select the relevant clinic session.

Every manual booking must be inserted into the same authoritative queue as online bookings.

Record the booking source, creation timestamp and responsible staff member.

Do not maintain a separate, disconnected queue for walk-ins.

### 8.4 Priority handling

Provide a controlled priority workflow for authorized staff.

- Only permitted staff can apply a priority change.
- Require a reason for the change.
- Record the responsible staff member and timestamp.
- Recalculate queue estimates after the change.
- Maintain an audit record.
- Clearly communicate that queue order and waiting-time estimates can change.

Do not allow patients to assign themselves priority.

Do not implement an AI medical-triage or diagnosis system. The clinic must define and approve its priority policy.

### 8.5 Session management

Receptionists should be able to view session status. Administrators should be able to configure and manage sessions.

Support:

- Morning and evening sessions if configured.
- Session opening and closure.
- Pausing online bookings.
- Temporarily marking the clinic delayed or unavailable.
- Configurable token limits.
- A documented policy for unfinished consultations and bookings at session closure.
- Starting a new session without deleting historical data.

## 9. Administrator Settings

Build settings pages for:

### Clinic profile
- Clinic name.
- Logo.
- Address.
- Contact details.
- Doctor's displayed name.
- Time zone.
- Public clinic information.

### Operating schedule
- Working days.
- Opening and closing times.
- Session start and end times.
- Break periods where applicable.
- Holiday and closure configuration.

### Booking rules
- Same-day or advance booking.
- Maximum bookings per session.
- Booking cutoff time.
- Cancellation cutoff.
- Duplicate booking policy.
- Permitted visit categories.
- Booking limits per patient where appropriate.

### Queue rules
- Token numbering and reset policy.
- Manual and online queue integration.
- Missed-turn policy.
- No-show policy.
- Reinstatement rules.
- Priority permissions.
- Consultation duration defaults.
- Arrival buffer.
- Waiting-time estimation configuration.

### Staff management
- Staff accounts.
- Role assignments.
- Staff activation and deactivation.
- Permission enforcement.
- Activity logs.

Changes to critical settings should be validated and, where appropriate, confirmed before saving.

## 10. Queue Logic and Status Transitions

Implement the queue logic in the backend and database, not in frontend-only state.

Suggested booking statuses:

- `booked`
- `checked_in`
- `called`
- `serving`
- `completed`
- `skipped`
- `cancelled`
- `no_show`

Define the allowed state transitions explicitly. For example:

- Booked â†’ Checked in.
- Checked in â†’ Called.
- Called â†’ Serving.
- Serving â†’ Completed.
- Called â†’ Skipped.
- Skipped â†’ Checked in or another policy-approved state.
- Booked â†’ Cancelled.
- Booked â†’ No-show when the configured rules are satisfied.

Invalid transitions must be rejected by the backend.

Do not confuse authentication state, booking state and consultation state.

### Token assignment

- Generate tokens on the backend.
- Use a database transaction, sequence or equivalent concurrency-safe method.
- Ensure token uniqueness within the defined clinic session.
- Use a stable session identifier.
- Never renumber existing bookings when another booking is cancelled.
- Define whether token numbering resets daily or per session.
- Handle simultaneous online and manual bookings safely.
- Preserve historical bookings.

### Queue ordering

Implement an explicit queue-ordering policy that accounts for:

- Session.
- Eligible booking status.
- Check-in requirements.
- Assigned token order.
- Approved priority changes.
- Skipped or cancelled status.
- Reinstatement rules.

Do not assume token number alone is sufficient for every queue decision.

### Walk-ins and manual tokens

Walk-ins and telephone bookings must enter the same queue as online bookings. If the clinic continues using a manual process outside the system, staff must enter those bookings so the website can calculate meaningful queue information.

## 11. Waiting-Time Estimation

Start with a transparent, rules-based algorithm.

Potential inputs:

- Current consultation's elapsed time.
- Recent completed consultation durations.
- Number of eligible patients ahead.
- Checked-in status of patients ahead.
- Historical skip and no-show patterns, if enough data exists.
- Clinic session and breaks.
- Authorized priority changes.
- Current delays.

Use actual recorded consultation start and end timestamps when available.

Return an estimated time range rather than promising an exact consultation time.

For example:

- Estimated consultation: approximately 10:45â€“11:05 AM.
- Recommended arrival: approximately 10:30 AM.
- Status: Estimate may change.

The values above are illustrative only.

Do not treat patients who have not checked in as guaranteed arrivals. Apply the clinic's policy consistently and communicate uncertainty.

If there is insufficient reliable data, show a cautious estimate or indicate that the estimate is not yet available.

Record actual consultation durations so the estimation method can be evaluated and improved.

## 12. Database Design

Create migrations and document the schema.

Suggested tables:

### `profiles`
- User ID linked to Supabase Auth.
- Display name.
- Mobile number reference where required.
- Profile metadata.
- Created and updated timestamps.

### `staff_roles`
- User ID.
- Role.
- Active status.
- Assigned by.
- Created and updated timestamps.

Supported initial roles: `admin`, `receptionist`.

### `clinic_settings`
- Clinic profile information.
- Operating hours.
- Session configuration.
- Booking rules.
- Token limits.
- Arrival buffer.
- Queue policies.

### `clinic_sessions`
- Session ID.
- Session date.
- Session type.
- Opening and closing timestamps.
- Session status.
- Token allocation configuration.

### `bookings`
- Booking ID.
- Patient user ID when authenticated.
- Session ID.
- Token number.
- Booking reference.
- Booking source.
- Visit category where needed.
- Booking status.
- Created timestamp.
- Check-in timestamp.
- Called timestamp.
- Consultation start timestamp.
- Consultation completion timestamp.
- Cancellation timestamp and reason where applicable.
- Responsible staff reference for manual actions.

### `queue_events`
- Event ID.
- Booking ID.
- Event type.
- Previous and new status.
- Timestamp.
- Responsible staff user ID where applicable.
- Reason or minimal structured metadata.

### `staff_audit_logs`
- Actor.
- Action.
- Target record.
- Timestamp.
- Relevant before/after changes, avoiding unnecessary sensitive data.

Optional later tables can support notifications and prediction metrics.

Use foreign keys, constraints, indexes and uniqueness rules. Prevent duplicate token numbers within the applicable session.

Avoid collecting detailed medical histories or symptoms in this queue-management application.

## 13. API Design

Use a versioned API prefix such as `/api/v1`.

Suggested public or patient endpoints:

- `GET /api/v1/clinic`
- `GET /api/v1/clinic/sessions`
- `GET /api/v1/queue/public`
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/mine`
- `GET /api/v1/bookings/{booking_id}`
- `POST /api/v1/bookings/{booking_id}/cancel`

Suggested staff endpoints:

- `GET /api/v1/staff/dashboard`
- `GET /api/v1/staff/queue`
- `POST /api/v1/staff/bookings`
- `POST /api/v1/staff/bookings/{booking_id}/check-in`
- `POST /api/v1/staff/bookings/{booking_id}/call`
- `POST /api/v1/staff/bookings/{booking_id}/start`
- `POST /api/v1/staff/bookings/{booking_id}/complete`
- `POST /api/v1/staff/bookings/{booking_id}/skip`
- `POST /api/v1/staff/bookings/{booking_id}/reinstate`
- `POST /api/v1/staff/bookings/{booking_id}/cancel`
- `POST /api/v1/staff/bookings/{booking_id}/priority`

Suggested administrator endpoints:

- `GET /api/v1/admin/settings`
- `PATCH /api/v1/admin/settings`
- `GET /api/v1/admin/staff`
- `POST /api/v1/admin/staff`
- `PATCH /api/v1/admin/staff/{user_id}`
- `GET /api/v1/admin/reports`
- `GET /api/v1/admin/audit-logs`

These are proposed API contracts. Define request and response schemas, validation rules, permissions and error formats for each endpoint before implementation. Use HTTP methods consistently and avoid unnecessary state-changing GET requests.

Implement only the endpoints required by the actual pages. Do not create fake endpoints that merely return hardcoded success responses.

## 14. Authentication and Security

- Use Supabase Auth for patient phone verification.
- Verify the authenticated user's identity on every protected request.
- Validate access tokens server-side.
- Enforce staff roles on the backend for every staff/admin action.
- Do not trust role values supplied by the frontend.
- Ensure patients can access only their own private bookings.
- Keep public queue endpoints limited to non-sensitive fields.
- Configure Supabase RLS policies for any frontend-accessible tables.
- Keep privileged database access restricted to the backend.
- Never expose the service-role key in Vite environment variables or browser bundles.
- Use secure session handling and appropriate CORS restrictions.
- Validate input and handle database errors safely.
- Add rate limiting to booking and authentication-related endpoints.
- Prevent OTP abuse and repeated booking spam.
- Avoid logging OTPs, credentials, access tokens or unnecessary personal data.
- Record important staff queue changes in an audit log.
- Apply sensible retention and deletion rules for personal information.
- Keep production and development credentials separate.

If the frontend uses Supabase Auth directly, send the authenticated access token to FastAPI and verify it on the backend before returning private data.

## 15. Live Queue Updates

For the first implementation, polling every 15â€“30 seconds is acceptable.

- Fetch fresh queue information.
- Display the last-updated time.
- Handle network failures without losing the booking.
- Avoid repeatedly requesting the same data unnecessarily.
- Stop or reduce polling when a page is inactive where practical.

Supabase Realtime can be added when the database security policies are verified. Never broadcast private patient records through public channels.

The system must remain correct even if updates arrive late or the frontend temporarily disconnects.

## 16. Notifications

Do not make email mandatory.

For the first version, display booking confirmation and queue updates inside the website.

Phone SMS notifications can be implemented later if an affordable provider is available. Do not assume SMS or WhatsApp notifications are free.

Browser notifications may be an optional enhancement, but they must not be the only way a patient learns about an important queue change.

## 17. UI and UX Requirements

Use a modern, clean, trustworthy healthcare interface.

Design principles:

- Mobile-first and responsive.
- Simple navigation.
- Clear typography and spacing.
- High contrast and readable text.
- Accessible labels and form errors.
- Large touch targets.
- Clear booking confirmation.
- Distinct status labels.
- Minimal unnecessary animations.
- Loading, empty, error and success states.
- Confirmation for destructive or consequential staff actions.
- No excessive medical information.
- No fake statistics or fabricated patient data in production.

The patient interface should feel welcoming and straightforward. The staff dashboard should prioritize operational speed, visibility and error prevention.

### Current visual baseline

The homepage follows a 60-30-10 palette: pure white as the dominant canvas, soft blue and muted charcoal for structure and copy, and teal (`#087F78`) reserved for primary CTA buttons. Open Sans follows the shared 1.250 Major Third type scale defined in `frontend/src/styles/global.css`: H1 40px/1.2/700/-0.02em; H2 32px/1.25/700/-0.01em; H3 24px/1.3/600; H4 20px/1.4/600; body 16â€“18px/1.5â€“1.6/400; and captions 14px/1.5/400/+0.01em. H5 and H6 extend the scale at 18px and 16px. The homepage includes the reference header, split hero with replaceable clinic photo and illustrative phone/queue artwork, four-step explainer, booking CTA panel, and multi-column footer. The queue art is illustrative; booking, tracking, staff, and admin workflows still require backend implementation.

Use reusable components and a consistent design system rather than duplicating UI across pages.

## 18. Deployment

### Frontend on Vercel
- Build and deploy the React/Vite application.
- Configure the production API base URL.
- Configure SPA routing fallback where required.
- Keep all private secrets out of frontend variables.
- Test the deployed website on desktop and mobile.

### Backend on Render
- Deploy the FastAPI application as a Python Web Service.
- Configure the correct build and start commands.
- Bind the server to the required host and port.
- Configure production environment variables.
- Implement a health endpoint.
- Add useful server logs without exposing sensitive data.
- Handle database connection errors and restarts.

### Supabase
- Create the PostgreSQL schema through migrations.
- Configure authentication.
- Configure RLS where applicable.
- Set up database constraints and indexes.
- Configure development and production environments separately.
- Check free-plan limits and backup capabilities.

Important: a free Render web service may sleep after inactivity. The frontend can remain available while the first backend request takes longer to respond. Do not claim zero downtime or guaranteed instant responses.

## 19. AI Roadmap

AI is a later enhancement, not a dependency for core functionality.

### Stage 1
Use a transparent rules-based waiting-time estimator.

### Stage 2
Collect sufficient operational data and evaluate prediction errors.

### Stage 3
Train a model to predict consultation duration or waiting time, using only suitable, minimized and appropriately protected data.

### Stage 4
Compare model performance against the rules-based baseline and deploy only if it provides a measurable improvement.

Never let an AI model independently diagnose emergencies, make medical decisions or override the clinic's approved priority policy.

## 20. Testing Requirements

Implement and test:

- Successful phone authentication using supported test configurations.
- Invalid OTP and expired-session handling.
- Unauthorized staff access.
- Patient access to another patient's booking.
- Duplicate and simultaneous bookings.
- Unique token assignment.
- Online booking mixed with walk-in bookings.
- Check-in, call, start and completion transitions.
- Skipped, cancelled and reinstated patients.
- Authorized priority changes.
- Queue recalculation after relevant events.
- Session closure and next-session token numbering.
- Waiting-time calculations.
- Network errors and backend restarts.
- Invalid settings and unauthorized role changes.
- Mobile responsiveness and accessible forms.
- Database migrations and constraints.
- Production environment configuration.

Create automated backend tests for the queue rules and API permissions. Include test data that cannot accidentally be mistaken for real clinic bookings.

## 21. Development Workflow

Build the project in these stages:

1. Inspect the repository and confirm the starting state.
2. Establish the project structure and design system.
3. Create the database schema and migrations.
4. Implement authentication and backend authorization.
5. Implement session handling and concurrency-safe token assignment.
6. Implement queue status transitions and waiting-time estimation.
7. Build the patient booking and tracking interface.
8. Build the receptionist dashboard and manual booking workflow.
9. Build administrator settings, staff permissions and audit logs.
10. Integrate live queue updates.
11. Write and run automated tests.
12. Deploy the frontend and backend.
13. Verify the complete production workflow.
14. Document setup, environment variables, deployment and limitations.

Do not stop after building the homepage. Continue until the booking, queue and staff workflows work together against the real database.

If any external service requires paid access, document the limitation and implement a secure development/testing alternative without pretending that the production service is operational.

## 22. Definition of Done

QueueCare is considered ready for its initial college demonstration when:

- A patient can verify a test phone number and book a token.
- The backend assigns a unique token for the correct session.
- The patient can view their own booking and queue estimate.
- A receptionist can add a walk-in patient to the same queue.
- Receptionists can check in, call, start, skip and complete patients.
- Queue estimates update when relevant statuses change.
- Administrators can change clinic settings and staff permissions.
- Unauthorized users cannot perform staff actions.
- Patients cannot read other patients' private booking data.
- Data persists in Supabase across backend restarts.
- The deployed frontend and backend communicate correctly.
- Setup and deployment instructions are documented.
- No critical workflow relies on hardcoded success responses or fabricated live data.

## Final Instruction to the Coding Agent

Build QueueCare as a complete, maintainable, secure and responsive single-clinic token management application. Prioritize correct queue logic, patient privacy, staff authorization, concurrency-safe token allocation and reliable booking workflows over decorative features.

First inspect the existing project files and explain the implementation plan. Then build and test the application incrementally, keeping the patient portal, receptionist dashboard and administrator settings connected to the same authoritative backend and database.

Do not claim a feature is complete until it has been implemented and verified. Clearly document any dependency, configuration or production limitation that prevents a feature from working end to end.
