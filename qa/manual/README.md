# QA Documentation — soundbeyondborders.com

[![Security Regression](https://github.com/turtlemeow87-design/tradscendence-site/actions/workflows/newman-security.yml/badge.svg)](https://github.com/turtlemeow87-design/tradscendence-site/actions/workflows/newman-security.yml)

This folder contains all quality assurance artifacts for soundbeyondborders.com,
a live full-stack music booking web application built with Astro, TypeScript,
and PostgreSQL, deployed on Vercel.

---

## Tools Used

| Tool | Purpose |
|---|---|
| Postman | API testing, collection runner, environment management |
| Newman | CLI runner for Postman collections (local + CI) |
| Mockoon | Mock server for local development testing |
| Playwright | Exploratory automated UI testing (contact form) |
| Chrome DevTools | Manual inspection, network monitoring, mobile emulation |
| axe DevTools | Automated accessibility scanning (WCAG 2.1 AA) |
| Windows Narrator | Screen reader testing for keyboard and accessibility verification |
| Neon SQL Editor | Database validation queries against live PostgreSQL data |
| Jira | Bug tracking and ticket management |
| GitHub | Version control and artifact storage |

---

## Folder Structure

```
qa/
├── automation-tests/         # Playwright automated UI tests (contact form)
├── evidence/                 # Screenshots for bug reports and test sessions
├── fixtures/                 # Test fixture files (PDFs for Postman file upload requests)
│                               Postman working directory set to this folder
├── manual/
│   ├── bug-reports/          # Filed bug reports (BR-001 through BR-012)
│   ├── test-cases/           # Manual test case documents (TC-001 through TC-008)
│   └── test-sessions/        # Executed test session logs (TS-001 through TS-004)
├── Mockoon/                  # Mock server configuration
├── Postman/
│   ├── results/              # Newman JSON output (gitignored)
│   ├── Security Regression.postman_collection.json
│   ├── Tradscendence = Runner.postman_environment.json   # committed (values blanked)
│   └── tradscendence-runner.LOCAL.postman_environment.json  # local only (gitignored)
├── automation-candidates.md  # Features identified for future automation
├── test-plan.md              # Overall test plan and scope
└── traceability-matrix.md    # Maps test cases to requirements
```

---

## What Has Been Tested

### Contact / Booking Form (Manual UI)
- 8 manual test cases covering happy path, validation, and UI behavior
- 3 test sessions logged including bug confirmation and regression retests
- 2 bugs discovered, fixed, and verified (BR-002, BR-003)
- See `manual/test-cases/TC-001-contact-form.md` and `manual/test-sessions/TS-001-contact-form.md`

### Contact Form — Database Validation (SQL)
- 4 database validation test cases against the live `contact_submissions` table
- Verified form data writes correctly at the data layer using Neon SQL Editor
- See `manual/test-cases/TC-002-db-validation-contact-submissions.md`

### Core Navigation (Manual UI)
- 8 manual test cases covering desktop nav, mobile hamburger menu, routing, and hidden future links
- Includes keyboard accessibility and outside-click/Escape key dismissal behavior
- See `manual/test-cases/TC-003-nav-core-pages.md`

### Instruments API (Postman)
- 5 endpoints tested across GET, POST, and DELETE
- 14 assertions — all passing in Local and Production environments

### Contact API (Postman)
- 8 scenarios tested including happy path, validation errors, and edge cases
- All passing in Local environment

### Authentication — Route Protection (Manual UI + Network)
- TC-007: Full authentication enforcement — unauthenticated /dashboard redirect,
  auth/register redirect for logged-in users, logout cookie removal
- Verified via 302 → 200 redirect chain in DevTools Network tab
- See `manual/test-cases/TC-007-auth-enforcement.md`

### Authorization — Horizontal Privilege Escalation / IDOR (Manual + Postman)
- TC-008: Cross-account access attempts against contracts, invoices, and booking submissions
- Verified User A (theast.qa@gmail.com) cannot access User B (huntereast.musiq@gmail.com) resources
- All attempts returned 403 Forbidden as expected
- See `manual/test-cases/TC-008-idor-privilege-escalation.md`

### Security Regression Suite (Postman + Newman)
- 27 requests across 6 active folders — all assertions passing
- Covers admin key enforcement, IDOR read/write, password reset boundary, input validation
- Full collection in `Postman/Security Regression.postman_collection.json`
- See CI Pipeline section below

### Automated UI (Playwright)
- Contact form test suite written and passing
- Covers form submission, multi-select dropdowns, validation, and success redirect
- Located in `automation-tests/qa-contact-form.spec.ts`

### Accessibility
- Full site keyboard navigation tested using Windows Narrator
- Automated scan on home page using axe DevTools (WCAG 2.1 AA)
- 1 actionable issue found: "Book me" button color contrast failure (BR-005)
- See `manual/test-sessions/TS-003-accessibility-testing.md`

---

## Bug Reports

| ID | Summary | Severity | Status |
|---|---|---|---|
| BR-001 | *(resolved)* | — | ✅ Closed |
| BR-002 | Phone field: leading country code not stripped from formatted output | Low | ✅ Closed |
| BR-003 | "Other" genre textarea persists after pill removal | Medium | ✅ Closed |
| BR-004 | Intermittent SSL protocol error on custom domain | Medium | ✅ Closed |
| BR-005 | "Book me" button fails WCAG 2.1 AA color contrast (2.12:1 actual, 4.5:1 required) | Medium | 🔴 Open |
| BR-006 | *(resolved)* | — | ✅ Closed |
| BR-007 | Hover audio unlock failure — iOS/mobile silent until user gesture | Medium | ✅ Closed |
| BR-008 | favicon.ico returning 404 | Low | ✅ Closed |
| BR-009 | AbortError race condition on audio teaser cancellation | Low | ✅ Closed |
| BR-010 | *(resolved)* | — | ✅ Closed |
| BR-011 | *(resolved)* | — | ✅ Closed |
| BR-012 | *(resolved)* | — | ✅ Closed |

---

## Naming Conventions

- `TC-XXX` — Test case files
- `TS-XXX` — Test session files
- `BR-XXX` — Bug report files

---

## CI Pipeline

A GitHub Actions workflow runs the Newman security regression suite on every
push to `main`. The pipeline covers all stateless security boundaries that do
not require authenticated sessions:

- Folder 02 — Admin: Missing Key
- Folder 03 — Admin: Invalid Key
- Folder 07 — Input Validation (admin endpoints only)

**Auth-dependent tests (Folders 04, 05, 06, and review validation in Folder 08)
are run locally.** These tests require short-lived JWT tokens (7-day expiry)
that cannot be stored as static CI secrets without frequent manual rotation.
Local runs use a gitignored environment file with live token values.

To run the full suite locally:
```bash
npm run test:security
```

To run CI-equivalent tests only:
```bash
npm run test:security:ci
```

### Excluded from Automated Run

**Reviews - Script Injection in Body (Observation)**
- Location: Security Regression > 08 - Manual Only
- Reason: Stateful test (writes to DB on each run, requires manual cleanup)
  and requires visual verification on /memories page that cannot be asserted
  programmatically.
- Manual test only — run before releases, verify output escaping on /memories
  after approving the review in admin panel, then delete the review from DB.

---

## Future Plans

- [ ] Forgot password flow test cases (TC-009 or similar)
- [ ] Formal QA documentation for Layers 5–6 (memories system, reviews system)
- [ ] axe DevTools scans on remaining pages (dashboard, admin panel, memories)
- [ ] Mobile screen reader testing (TalkBack / VoiceOver)
- [ ] Physical device testing on contact form and navigation