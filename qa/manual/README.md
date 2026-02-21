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
| Jira | Bug tracking and ticket management |
| GitHub | Version control and artifact storage |

---

## Folder Structure
```
qa/
├── automation-tests/         # Playwright automated UI tests (contact form)
├── manual/
│   ├── bug-reports/          # Filed bug reports (BR-001, BR-002, BR-003)
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

---

## Naming Conventions

- `TC-XXX` — Test case files
- `TS-XXX` — Test session files
- `BR-XXX` — Bug report files

---

## Future Plans

- Physical device testing on contact form and navigation
- SQL queries for database write verification
- Additional test cases for navigation and media playback pages
- GitHub Actions for automated API runs on push