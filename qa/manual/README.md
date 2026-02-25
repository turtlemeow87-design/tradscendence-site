# QA Documentation — soundbeyondborders.com

This folder contains all quality assurance artifacts for soundbeyondborders.com,
a live full-stack music booking web application built with Astro, TypeScript,
and PostgreSQL, deployed on Vercel.

---

## Tools Used

| Tool | Purpose |
|---|---|
| Postman | API testing, collection runner, environment management |
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
├── manual/
│   ├── bug-reports/          # Filed bug reports (BR-001 through BR-005)
│   ├── test-cases/           # Manual test case documents
│   └── test-sessions/        # Executed test session logs
├── Mockoon/                  # Mock server configuration
├── Postman/                  # Exported Postman collections
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
- 4 database validation test cases written against the live `contact_submissions` table
- Verified form data writes correctly at the data layer using Neon SQL Editor
- Checked required field constraints, array storage for multi-select fields, and duplicate detection
- All passing — see `manual/test-cases/TC-002-db-validation-contact-submissions.md` and `manual/test-sessions/TS-002-db-validation-contact-submissions.md`

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

### Automated UI (Playwright)
- Contact form test suite written and passing
- Covers form submission, multi-select dropdowns, validation, and success redirect
- Located in `automation-tests/qa-contact-form.spec.ts`

### Accessibility
- Full site keyboard navigation tested using Windows Narrator (screen reader)
- Automated scan run on home page using axe DevTools against WCAG 2.1 AA standard
- Site passed screen reader testing — nav links, hamburger menu, and ARIA states all announced correctly
- 1 actionable issue found: "Book me" button fails minimum color contrast requirement (BR-005)
- 5 additional issues flagged from embedded YouTube player — third-party code, out of scope
- See `manual/test-sessions/TS-003-accessibility-testing.md`

---

## Bug Reports

| ID | Summary | Status |
|---|---|---|
| BR-001 | Contact form — initial bug | Resolved |
| BR-002 | Contact form bug | Resolved |
| BR-003 | Contact form bug | Resolved |
| BR-004 | Intermittent SSL protocol error on custom domain | Open |
| BR-005 | "Book me" button fails WCAG 2.1 AA color contrast requirement | Open |

---

## Naming Conventions

- `TC-XXX` — Test case files
- `TS-XXX` — Test session files
- `BR-XXX` — Bug report files

---

## Future Plans

- Physical device testing on contact form and navigation
- Test cases for media playback pages (TC-004)
- axe DevTools scans on remaining pages beyond home
- Mobile screen reader testing (TalkBack / VoiceOver)
- GitHub Actions for automated API runs on push
- Newman CLI for command-line Postman collection runs