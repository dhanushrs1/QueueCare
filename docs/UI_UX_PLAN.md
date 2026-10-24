# QueueCare — UI/UX Design Plan

## Product design goal

Make it easy for patients to know what to do next and when to leave for the clinic. Help receptionists keep the real queue accurate with as few clicks and mistakes as possible. Keep the interface reassuring and clear without suggesting that waiting-time estimates are guarantees.

The current homepage follows the supplied visual reference: a clean navigation header, split clinic-photo hero with an illustrative phone and queue display, a four-step “How it works” section, a booking call-to-action panel, and a multi-column footer. The queue display is illustrative and does not claim live clinic data. Patient booking, staff, and admin screens remain product workflows to implement against the backend.

## Experience principles

1. **Mobile-first for patients.** Booking and tracking should work comfortably with one hand on a phone.
2. **Operational clarity for staff.** The current patient, next action, delays, and queue exceptions should be immediately visible.
3. **One source of truth.** Patient pages and staff screens reflect saved backend state, with a visible last-updated time.
4. **Progressive disclosure.** Ask for only the information needed at each step; put detailed settings behind admin screens.
5. **Accessible by default.** Use semantic headings and labels, keyboard support, visible focus, readable contrast, large touch targets, and errors that explain how to recover.
6. **Privacy in public.** Public-facing screens show token/aggregate information only. Keep names and phone numbers inside authorized staff views.

## Visual direction

Use the 60-30-10 color balance throughout the site: approximately 60% clean white canvas, 30% soft blue/muted charcoal structure and text, and 10% accent. Use teal (`#087F78`) strictly for primary call-to-action buttons and their hover state; use soft blue (`#EAF3F7`, `#F2F8FB`) for cards, information bands, and visual grouping. Keep all body copy and headings in readable dark blue-gray. Reserve green, amber, and red for meaningful operational status, always paired with a text label.

### Suggested design tokens

| Token | Starting direction | Use |
|---|---|---|
| Dominant | Pure white, `#FFFFFF` | Page canvas and primary surfaces (about 60%) |
| Secondary | Soft blue, `#EAF3F7` / `#F2F8FB` | Structure, panels, cards, separators (about 30%) |
| Secondary text | Dark blue-gray, `#18334A` / `#526B7E` | Headings and body copy |
| CTA accent | Teal, `#087F78` | Primary action buttons only (about 10%) |
| CTA hover | Deep teal, `#06645E` | Primary button hover/pressed state |
| Surface | White | Cards, forms, queue rows |
| Supporting text | Blue-gray, `#526B7E` | Supporting text and timestamps |
| Success | Green with pale green background | Completed/available states |
| Attention | Amber with pale amber background | Delays, waiting, estimate changes |
| Critical | Red with pale red background | Errors, paused service, destructive confirmation |
| Border | Soft neutral gray-green | Dividers, card edges, input outlines |

Treat these as initial design values, not fixed brand requirements. Confirm contrast for text and controls before implementation. Do not communicate status by color alone; pair every status color with a label or icon.

### Typography and layout

Use Open Sans across the complete website. The frontend defines the following 1.250 Major Third scale in `frontend/src/styles/global.css`; page styles should use these shared tokens instead of redefining heading sizes.

| Element | Size | Line height | Weight | Letter spacing |
|---|---:|---:|---:|---:|
| H1 | 40px / 2.5rem | 1.2 / 48px | 700 | -0.02em |
| H2 | 32px / 2rem | 1.25 / 40px | 700 | -0.01em |
| H3 | 24px / 1.5rem | 1.3 / 31.2px | 600 | 0 |
| H4 | 20px / 1.25rem | 1.4 / 28px | 600 | 0 |
| H5 | 18px / 1.125rem | 1.4 | 600 | 0 |
| H6 | 16px / 1rem | 1.5 | 600 | 0 |
| Body | 17px default; allowed 16–18px | 1.5–1.6 | 400 | 0 |
| Small/caption | 14px / 0.875rem | 1.5 / 21px | 400 | 0.01em |

Keep paragraph measure around 45–75 characters per line. Maintain at least 16px body text on mobile and desktop. Apply this scale to buttons, forms, dialog copy, staff screens, status text, and future pages, not only the landing page.

- Keep patient content in a centered, narrow column on desktop; allow full width on mobile.
- Use a persistent, compact clinic identity in patient pages, with no heavy navigation.
- Use a wider desktop workspace for staff, with a sidebar and a sticky top bar.
- Prefer consistent spacing and simple cards over dense borders or shadows.

## Information architecture

### Patient site

- Home / clinic status
- Book a token
- Verify phone / sign in
- Booking confirmation
- My bookings / track booking
- Public queue status
- Help and clinic contact

### Staff application

- Staff sign in
- Today dashboard
- Live queue
- Bookings / search
- Reports
- Settings (admin only)
- Staff and permissions (admin only)

Keep patient and staff navigation visually distinct so patients do not mistake staff tools for part of their booking flow.

## Key patient journeys

### 1. First-time booking

1. Patient lands on the clinic page and immediately sees whether the clinic is open, current queue status, and a primary **Book a token** action.
2. Patient chooses an available date/session only if booking configuration requires it.
3. Patient enters a mobile number with country code and requests an OTP.
4. OTP entry screen explains where the code was sent, supports resend cooldown, and lets the user correct the number.
5. Patient confirms or enters the minimum required profile details and visit category, if enabled.
6. Review screen shows the selected session and relevant cancellation/check-in policy.
7. Backend creates the booking; confirmation displays the saved reference and token, current queue context, estimate range if available, recommended arrival, and a **Track my token** action.

Keep the flow to a small number of focused screens. Preserve entered non-sensitive values when an OTP expires or the user navigates back. Never show a success state before the backend confirms the booking.

### 2. Returning patient tracking

1. Patient signs in by phone OTP.
2. The active booking is the first card, with token number, session, status, estimate range, arrival suggestion, and last-updated time.
3. A compact queue-progress display shows current serving token and an approximate count ahead, if allowed and meaningful.
4. Patient can open booking details or cancel only when permitted.
5. If data is stale or unavailable, state this plainly and provide a retry action; do not display an old estimate as current.

### 3. Public queue view

Show clinic status, current serving token, waiting count, and a concise delay/estimate notice. Do not show names, phone numbers, booking references, or personal visit details. Offer a route to book or track a token.

## Key staff journeys

### 1. Start of session

- Dashboard presents today's session state and any important delay or closure notice.
- Receptionist can see total bookings, waiting, checked-in, serving, completed, skipped, and cancelled counts.
- A prominent queue panel shows the current serving patient and the next eligible action.
- Session controls appear only for users with permission.

### 2. Manage queue

- Use a dense but readable table on desktop and stacked queue cards on narrow screens.
- Keep token, patient name, source, status, check-in, and primary next action visible.
- Put secondary actions in a menu, not beside every row as competing buttons.
- Provide fast filters for status/source and search by approved fields.
- Use a stable visual marker for online, telephone, and walk-in source.
- Ask for a reason when required (priority, cancellation/correction, reinstate) and show a confirmation for consequential actions.
- After an action, update the row and show a brief confirmation with undo only if the backend policy supports safe undo.

### 3. Register a walk-in or phone booking

- A single **Add booking** action offers source selection or preselects the source from a clear button.
- Keep required fields minimal: patient name, mobile number where policy requires, session, and visit type if enabled.
- Show the assigned token only after the backend saves it.
- Mark staff-created entries clearly in the queue and retain who entered them in the audit trail.

### 4. Priority handling

- Keep this action permission-gated and visually distinct from ordinary queue controls.
- Require a reason, show a review step, and explain that queue order/estimates may change.
- Display an unobtrusive priority marker in the staff queue, with no public medical explanation.

## Screen-level layout suggestions

### Patient home

1. Clinic name and contact/help link.
2. Status banner: Open, Closed, Delayed, or Paused, with plain-language explanation.
3. Main action card: **Book a token**.
4. Queue snapshot: current token and aggregate waiting information.
5. Secondary action: Track an existing booking.
6. Schedule, address/directions, and brief “How it works” steps.
7. Footer note: wait estimates can change; urgent symptoms should be handled according to clinic/emergency guidance (clinic-approved copy).

### Booking confirmation / tracking card

- Large token number with clear session/date.
- Status label and simple progress indicator.
- Estimate as a range, not a countdown promise; include confidence/availability wording where relevant.
- Recommended arrival time separated from estimated consultation time.
- Last updated timestamp and manual refresh affordance.
- Cancellation action only when allowed, with policy and confirmation.

### Receptionist dashboard

- Header with session/date, connection/freshness state, and staff menu.
- Summary metrics across the top; avoid making metrics more prominent than queue actions.
- Current consultation and **Call next**/next valid action in a dedicated panel.
- Queue table with filters and a clear empty state.
- Delay/session alerts in a dismissible but persistent banner where appropriate.

### Admin settings

Group settings into focused pages or sections: Clinic profile, Schedule and sessions, Booking rules, Queue rules, Staff access, and Audit history. Explain the effect of consequential settings, validate before saving, and show the saved state/timestamp. Avoid one enormous form.

## Components to establish early

- Button variants: primary, secondary, quiet, destructive.
- Text/phone inputs with labels, helper text, validation, and error states.
- Session/date selector with unavailable options disabled and explained.
- Status badge with text and optional icon.
- Queue summary/progress card.
- Booking card and queue row/card.
- Alert banners for clinic delay, connectivity, and stale data.
- Confirmation dialog with clear action wording.
- Empty/loading/error states.
- Toast or inline success confirmation for saved actions.
- Responsive navigation for patient and staff experiences.

## Important states and microcopy

Design all screens for loading, empty, error, success, stale data, and unavailable service—not only the ideal path.

Suggested plain-language messages:

- **Estimate available:** “Estimated consultation: around 10:45–11:05. This may change as the queue moves.”
- **Not enough data:** “Your token is confirmed. We can’t estimate your wait yet.”
- **Stale connection:** “Queue information may be out of date. Last updated at 10:12 AM.”
- **Booking failure:** “We couldn’t confirm this booking. No token has been reserved. Please try again.”
- **Clinic paused:** “Online bookings are paused while the clinic handles a delay. Please check back or call the clinic.”
- **No active booking:** “You don’t have an active token. Book one to see your place in the queue.”

Use clinic-approved wording for emergency guidance and policy explanations.

## Responsive and accessibility behavior

- Patient actions should be thumb-friendly, full-width when space is limited, and never depend on hover.
- On mobile, staff queue cards should expose the primary action first and tuck secondary actions into an accessible menu.
- Support keyboard-only navigation and clear focus rings.
- Associate errors with their fields and announce asynchronous success/error updates to assistive technology.
- Do not rely only on color, position, or animation to communicate queue state.
- Respect reduced-motion preferences and avoid rapid animated countdowns that imply precision.
- Keep touch targets around 44 px or larger where practical.

## UX risks to avoid

- Exact countdowns or guaranteed appointment times when queue duration varies.
- Showing patient identity on a public display or queue link.
- Assigning or displaying a token before the backend transaction succeeds.
- Confusing “booked” with “checked in” or “called.” Use distinct labels and explain what patients should do.
- Hiding errors behind a spinner or clearing a form after a failed submission.
- Giving receptionists too many per-row actions without guardrails.
- Making admin-only settings visible as if they were available to receptionists.
- Fake statistics or sample patients in production screens.

## Suggested design and build order

1. Establish the type, color, spacing, status, and component tokens.
2. Sketch patient mobile flows: home, phone verification, booking, confirmation, tracking.
3. Sketch receptionist desktop queue and mobile/narrow layout.
4. Sketch admin settings and permissions states.
5. Review the booking flow for accessibility, error recovery, and uncertain estimates.
6. Implement reusable components and responsive layouts.
7. Connect real API states and replace any prototypes/fixtures before production.

## Questions to settle during visual design

- What clinic name, logo, and brand colors should appear?
- Should patients select a session, or should the system assign the next available one?
- Is public display of the next token permitted, or should the public page show only aggregate counts?
- Which languages must the patient interface support?
- Does the clinic prefer a warm neighborhood-clinic feel or a more formal clinical look?

These choices can refine the visual design later; the layout and workflow plan does not depend on having final branding now.
