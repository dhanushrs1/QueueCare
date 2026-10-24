# QueueCare — Requirements and Setup Report

**Prepared:** 24 October 2026
**Source reviewed:** `about.txt`  
**Project status:** Requirements analyzed; application implementation has not started.

## 1. Executive summary

QueueCare is a single-clinic web application for phone-authenticated patient token booking, live queue visibility, and staff queue operations. Its most important system rule is that online bookings, telephone bookings, and walk-ins must use one authoritative backend queue and database.

The proposed stack is suitable for running the frontend and backend on separate servers:

- **Frontend:** React, Vite, TypeScript, deployed to Vercel.
- **Backend:** Python, FastAPI, deployed as a web service on Render.
- **Data and patient authentication:** Supabase PostgreSQL and Supabase Auth phone OTP.
- **Initial queue updates:** REST polling every 15–30 seconds. Realtime can follow after access policies are verified.

The browser calls FastAPI over HTTPS using a configured API base URL. It must never receive database credentials or the Supabase service-role key. The backend validates the user's Supabase access token and enforces patient/staff/admin permissions.

## 2. What the product needs to do

### Patient experience

- Show configurable clinic information, opening status, and privacy-safe public queue information.
- Verify a patient's mobile number using Supabase phone OTP.
- Let an authenticated patient book a token, see the saved booking confirmation, track their own booking, and cancel when policy permits.
- Show a cautious wait-time range and recommended arrival time when the available data supports one.
- Avoid exposing other patients' identity or booking details.

### Staff experience

- Provide a protected receptionist dashboard for today's queue and operational status.
- Let receptionists create telephone and walk-in bookings in the same queue as online bookings.
- Support the approved check-in, call, start, complete, skip, reinstate, and cancellation workflows.
- Record the source of a booking and staff member responsible for manual actions.
- Restrict priority changes to authorized staff, require a reason, and audit the change.

### Administrator experience

- Configure clinic details, schedule/sessions, booking limits and cutoffs, queue rules, and estimation parameters.
- Manage staff roles and access.
- Review activity logs and operational reports.
- Provision the first administrator through a secure, non-public setup process.

### Queue and data rules

- Generate token numbers on the backend with a database transaction or equivalent concurrency-safe mechanism.
- Enforce unique tokens within the configured session; never renumber existing bookings after cancellations.
- Define valid status transitions on the backend and reject invalid transitions.
- Preserve historical sessions and bookings.
- Use a transparent rules-based waiting estimate first; do not depend on an AI API.
- Collect only the personal information the clinic genuinely needs. Do not add medical histories or diagnosis/triage functionality.

## 3. Proposed system boundary

```text
Patient / Staff browser
        |
        | HTTPS JSON API + Supabase Auth access token
        v
Vercel: React / Vite frontend
        |
        | HTTPS requests to configured API URL
        v
Render: FastAPI REST backend
        |                         |
        | server-side DB access   | verify Supabase access tokens
        v                         v
Supabase PostgreSQL          Supabase Auth / phone OTP
```

FastAPI is the authority for booking creation, token allocation, queue status transitions, staff authorization, and private booking reads. Supabase Auth handles phone verification and user identity. Patient-facing frontend code may use the Supabase public/anon key for the supported auth flow, but the service-role key and database secrets stay server-side. Any tables directly exposed to a browser need carefully scoped RLS policies; privileged queue operations should go through FastAPI.

The frontend and backend have different origins in production. The backend must allow the exact Vercel production origin (and explicitly configured local development origins) through CORS. The frontend must use a configurable API URL, rather than assuming both servers share a host.

## 4. Requirements setup I recommend

### Repository layout

```text
QueueCare/
  frontend/                 # React + Vite + TypeScript
  backend/
    app/                    # FastAPI routes, schemas, services, auth
    migrations/             # Alembic migrations
    tests/                  # backend tests
    requirements.txt        # Python dependencies
  docs/
    REQUIREMENTS_SETUP.md   # this report
    API.md                  # API contracts as implementation proceeds
  .gitignore
  README.md
```

Keep frontend and backend independently installable and deployable. The frontend build should not require Python; the backend should not require the Vite build. Use migrations as the versioned source of database schema changes.

### Initial implementation sequence

1. Confirm clinic policies and deployment/configuration inputs listed in section 7.
2. Establish frontend and backend skeletons, local run instructions, and separate environment templates.
3. Design database migrations, session/token constraints, role model, and RLS boundaries.
4. Implement Supabase token verification and backend role authorization.
5. Implement session creation/configuration, concurrency-safe booking, and status transitions.
6. Add patient booking/tracking and privacy-safe public queue reads.
7. Add receptionist manual bookings and queue operations with audit events.
8. Add admin settings, staff controls, and reports.
9. Add estimate calculation and polling, then deploy to Vercel, Render, and Supabase.
10. Verify the end-to-end workflows and document operational limitations.

## 5. Configuration checklist

Use separate local/development and production values. These are names to configure, not actual credentials.

### Frontend environment (Vercel and local frontend)

- `VITE_API_BASE_URL` — FastAPI URL, e.g. local backend URL for development and Render URL for production.
- `VITE_SUPABASE_URL` — Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — Supabase public/anon key for browser-supported auth operations; never a service-role key.

Vite variables are included in the browser build. Only public values belong here.

### Backend environment (Render and local backend)

- `SUPABASE_URL` — Supabase project URL.
- `SUPABASE_JWKS_URL` or equivalent verification configuration — use the project's supported token verification method.
- `SUPABASE_SERVICE_ROLE_KEY` — only if the backend requires privileged Supabase operations; keep it only in Render/local backend secrets.
- `DATABASE_URL` — server-side database connection string if SQLAlchemy connects directly to PostgreSQL.
- `CORS_ALLOWED_ORIGINS` — exact frontend origin(s), comma-separated or structured as the application expects.
- `APP_ENV` — development/staging/production.
- `TIME_ZONE` — clinic's IANA timezone.
- `LOG_LEVEL` — environment-appropriate logging level.

Choose a single backend database access approach during implementation: direct SQLAlchemy/PostgreSQL access with migrations, or Supabase API access for the relevant operations. The spec asks for SQLAlchemy/Alembic and Supabase PostgreSQL; direct backend PostgreSQL access is a straightforward fit. Do not place `DATABASE_URL` in the frontend.

### Supabase dashboard configuration

- Create separate development and production projects if practical.
- Enable phone authentication and configure a supported SMS provider for production.
- Configure test phone numbers/OTP only for development or supported test use.
- Apply database migrations and any required RLS policies.
- Add the frontend auth redirect/site URLs.
- Provision the first admin securely; do not offer public admin self-registration.

Real OTP delivery may require an SMS provider and may incur costs. Supabase project and hosting plan limits should be checked before launch; free plans do not imply guaranteed uptime, backups, or instant cold starts.

## 6. API groups to implement

Use a versioned base path such as `/api/v1`.

- Public: clinic information, sessions/availability, privacy-safe queue summary.
- Patient: create booking, list own bookings, retrieve own booking, cancel eligible booking.
- Staff: dashboard/queue reads, manual booking, allowed status transitions, controlled priority action.
- Admin: settings, staff roles, reports, and audit log access.

Each endpoint needs a request/response schema, authentication requirement, role requirement, and error behavior. Implement only endpoints backing real product workflows. In particular, token assignment and queue state changes must never be simulated in frontend-only state.

## 7. Inputs needed from you / clinic

These are the decisions the source document deliberately leaves configurable. You can provide them now or during implementation.

### Needed before a usable clinic configuration or production launch

1. **Clinic identity:** clinic name, address/map link, contact number, logo if available, doctor display name if desired.
2. **Timezone and schedule:** IANA timezone (for example `Asia/Kolkata`), working days, opening/closing times, sessions, breaks, holidays.
3. **Token policy:** reset daily or per session; same-day versus advance booking; session capacity; booking cutoff; whether any token slots are reserved for walk-ins.
4. **Queue policy:** whether patients must check in before becoming eligible; how late arrivals/no-shows are handled; skip/reinstate behavior; closure behavior for unfinished patients.
5. **Cancellation and duplicates:** cancellation cutoff, whether patients may hold multiple active bookings, and how duplicate phone/date/session bookings are handled.
6. **Priority policy:** who may apply it, permitted reason categories, and how it affects ordering. This must be clinic-approved; the software should not decide medical urgency.
7. **Arrival and estimates:** recommended arrival buffer; any known typical consultation duration; whether to show estimates before enough real data exists.
8. **Staff provisioning:** names/phone numbers and initial roles for staff, plus who is authorized to provision the first administrator.
9. **OTP operations:** country/countries served, SMS provider choice/account and budget, and test numbers for development. Do not send secrets in chat; put them into the relevant secret manager or local ignored environment file.
10. **Deployment ownership:** Vercel, Render, and Supabase accounts/projects or confirmation you will create them; preferred project/repository naming and production domain if one exists.

### Useful but not blocking the first technical skeleton

- Brand colors and preferred visual references.
- Whether the public queue should show the next token or only aggregate waiting counts.
- Preferred visit categories (for example consultation/follow-up), if the clinic actually uses them.
- Data retention and account deletion expectations.

Do not provide real patient data for development. Use clearly synthetic fixtures.

## 8. Risks and open design points

- Phone OTP depends on a configured delivery provider and its availability/cost.
- A Render free service may sleep; first requests can be delayed.
- Wait-time estimates are inherently uncertain. Show ranges, update timestamps, and a clear caveat; never promise an exact consultation time.
- Direct PostgreSQL access, Supabase Auth token verification, RLS, and privileged backend access must be designed together. A service-role key bypasses RLS and must be treated as a server secret.
- Queue rules require clinic decisions. The app should not infer clinical triage or silently reorder patients.
- Audit logs should capture operational changes without copying unnecessary patient or medical information.

## 9. What this report delivers and what remains

This report converts the supplied overview into an architecture, environment setup checklist, suggested repository structure, implementation order, and a concrete list of clinic inputs. It is a requirements/setup artifact, not a running application. No accounts, cloud projects, credentials, database schema, frontend, or backend have been created yet.

Once the clinic inputs are settled, implementation can start with the repository skeleton, local environment templates, backend health route, frontend-to-backend connection, and database migrations. Production deployment will still require your service accounts and secrets to be configured in the respective provider dashboards.

## 10. Acceptance criteria for the initial demonstration

- A test patient completes supported phone OTP verification and books a token.
- FastAPI assigns a unique token to the correct session, including under concurrent booking attempts.
- The patient can see only their own booking; the public queue shows no private patient data.
- A receptionist can add a walk-in to the same queue and advance permitted state transitions.
- Staff-only and admin-only actions are enforced by FastAPI, not just hidden in the UI.
- Queue estimates reflect recorded queue state and expose uncertainty.
- Booking and staff actions persist in Supabase across backend restarts.
- The separately hosted frontend communicates with the backend through configured HTTPS/CORS.
- Setup, environment variables, migrations, and provider limitations are documented.
