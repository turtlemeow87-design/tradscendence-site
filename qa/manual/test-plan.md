# Test Plan — Sound Beyond Borders (soundbeyondborders.com)

**Project:** Sound Beyond Borders — Music Booking Website  
**Author:** Hunter Eastland  
**Last Updated:** March 2026  
**Status:** Active  

---

## 1. Overview

This test plan covers testing performed on the Sound Beyond Borders music booking website. The site is built with Astro (TypeScript), uses a Neon PostgreSQL database, and deploys via Vercel. Testing includes manual UI testing, API testing via Postman, Newman CLI automation, mock server simulation via Mockoon, and exploratory automated UI testing via Playwright.

---

## 2. Scope

### In Scope
- Contact/Booking form UI (manual testing)
- Instruments API endpoints (GET, POST, DELETE)
- Contact/Booking form API endpoint (POST)
- Input validation and error handling
- Authentication system (registration, login, OTP, logout, trusted device)
- Password reset flow (forgot password, OTP, reset token, new password)
- Authorization boundaries — role-based access control (admin vs. authenticated user vs. unauthenticated)
- Horizontal privilege escalation / IDOR prevention (cross-account resource access)
- Protected route redirect behavior (middleware enforcement)
- Document management API (contract upload, signing, invoice upload/download)
- Review submission and moderation flow
- Memories page content management
- Response structure and data integrity

### Out of Scope
- Third-party services (Resend email delivery internals, Neon database internals, Vercel Blob storage internals)
- Blog, calendar, and store pages (not yet built)

---

## 3. Test Environments

| Environment | Base URL | When Used |
|---|---|---|
| Local | `http://localhost:4321` | Active development, manual runs |
| Production | `https://soundbeyondborders.com` | Post-deployment verification and manual UI testing |

> **Note:** In the Local environment, the contact API skips database inserts and email sends by design (development mode flag). Production runs trigger real database writes and Resend email notifications.

Environments are managed as Postman Environment variables using `{{base_url}}` across all requests, allowing seamless switching without modifying individual requests.

---

## 4. Tools

| Tool | Purpose |
|---|---|
| Postman | API test authoring, collection runner, environment management |
| Newman | CLI runner for Postman collections — local and CI |
| Mockoon | Mock server simulating contact API responses for isolated testing |
| Jira | Bug tracking and ticket management (project: QA Testing / SCRUM) |
| GitHub | Version control, test artifact storage |
| GitHub Actions | CI pipeline — runs stateless Newman security suite on every push to main |
| Playwright | Exploratory automated UI testing (contact form — one suite completed) |
| Chrome DevTools | Manual inspection, network monitoring, mobile emulation |

---

## 5. Test Collections

### 5.1 Instruments API

Tests covering the public instruments listing, individual instrument pages, featured instruments, and admin CRUD operations.

| Request | Method | Endpoint | Auth Required |
|---|---|---|---|
| Populating Instruments | GET | `/api/instruments/index.json` | No |
| Returning a Single Instrument | GET | `/api/instruments/[slug].json` | No |
| Featured Instruments | GET | `/api/instruments/featured.json` | No |
| Admin Panel Add Instrument | POST | `/api/instruments/index.json` | Yes (x-admin-key) |
| Admin Panel Delete Instrument | DELETE | `/api/instruments/[slug].json` | Yes (x-admin-key) |

**Authentication:** Admin endpoints require an `x-admin-key` header matching the `ADMIN_API_KEY` environment variable.

**Total Tests:** 14 assertions across 5 requests  
**Status:** ✅ All passing (Local + Production)

---

### 5.2 Contact API Tests

Tests covering the booking/contact form submission endpoint, organized by scenario type.

#### Happy Path
| Request | Scenario |
|---|---|
| Happy Path - Full Booking | All fields populated including optional fields |
| Custom Genre | `genre_other` field populated with custom genre text |

#### Validation Errors
| Request | Scenario | Expected Status |
|---|---|---|
| Missing Required Fields | name, email, location, message all empty | 400 |
| Wrong Content Type | Request sent as `application/x-www-form-urlencoded` instead of JSON | 415 |

#### Edge Cases
| Request | Scenario | Expected Status |
|---|---|---|
| Invalid Email | Email field contains `not-an-email` | 400 |
| Invalid Date | Date field uses `MM/DD/YYYY` instead of required `YYYY-MM-DD` | 400 |
| Honeypot Triggered | Honeypot field contains text (bot detection) | 200 (silent pass) |
| Max Length Message | Message exceeds 4000 character limit (auto-clamped) | 200 |

**Status:** ✅ All passing (Local)

---

### 5.3 Security Regression Suite (Newman / Postman)

Tests covering authentication enforcement, admin authorization boundaries, IDOR prevention, password reset security, and input validation. Organized across 7 active folders plus one manual-only folder.

| Folder | Scope | Run Context |
|---|---|---|
| 02 - Admin: Missing Key | Admin endpoints with no key provided → 401 | CI + Local |
| 03 - Admin: Invalid Key | Admin endpoints with wrong key → 401 | CI + Local |
| 04 - IDOR: Read | Cross-account contract/invoice access → 403 | Local only |
| 05 - IDOR: Write | Cross-account review submission → 403 | Local only |
| 06 - Password Reset | Reset token boundary, tamper resistance | Local only |
| 07 - Input Validation | Admin-facing validation (stateless) | CI + Local |
| 08 - Manual Only | Script injection observation — see Excluded Tests below | Manual only |

**Total Automated:** 27 requests, 28 assertions, 0 failures  
**CI Coverage:** Folders 02, 03, 07 (stateless — admin key only)  
**Local Coverage:** All folders except 08  

#### Excluded Tests — Manual Only

**Reviews - Script Injection in Body (Observation)**  
Location: Security Regression > 08 - Manual Only  
Reason: Stateful test (writes to DB on each run, requires manual cleanup) and requires visual verification on `/memories` page that cannot be asserted programmatically.  
Run before releases — verify output escaping on `/memories` after approving the review in the admin panel, then delete the review from DB.

---

### 5.4 Manual UI Testing — Contact / Booking Form

| TC # | Title | Type | Status |
|---|---|---|---|
| TC-001 | Successful Full Booking Submission | Happy Path | ✅ Pass |
| TC-002 | Submit with Missing Required Fields | Validation | ✅ Pass |
| TC-003 | Phone Number Auto-Formatting | UI Behavior | ✅ Pass |
| TC-004 | Instrument Multi-Select with Pills | UI Behavior | ✅ Pass |
| TC-005 | "Other" Genre Reveals Custom Text Field | UI Behavior | ✅ Pass |
| TC-006 | Invalid Email Format | Validation | ✅ Pass |
| TC-007 | Email Link Alternative | UI Behavior | ✅ Pass |
| TC-008 | Form State After Failed Submission | Validation | ✅ Pass |

---

### 5.5 Manual UI Testing — Authentication

| TC # | Title | Type | Status |
|---|---|---|---|
| TC-007 | Authentication Enforcement (route protection, redirect behavior, logout) | Security | ✅ Pass |
| TC-008 | Horizontal Privilege Escalation / IDOR | Security | ✅ Pass |

---

## 6. Test Approach

### Manual UI Testing
Test cases are executed against the production site. Results are logged in test session documents including actual results, pass/fail status, and any bugs filed.

### Functional API Testing
Each API endpoint is tested for correct HTTP status codes, response structure (JSON shape), and field-level validation. Tests are written as Postman post-response scripts using `pm.test()` and `pm.expect()`.

### Security Testing
Authentication and authorization boundaries are tested at the API level using Postman. IDOR attempts use two separate test accounts with known resource IDs to verify that cross-account access returns 403. Admin boundary tests verify that both missing and invalid admin keys return 401. Script injection attempts are observed manually with visual verification on rendered pages.

### Positive Testing (Happy Path)
Verify that valid, well-formed requests return expected success responses with correct data shapes.

### Negative Testing (Validation & Edge Cases)
Verify that invalid inputs are correctly rejected with appropriate error codes and descriptive error messages.

### Mock Testing
Mockoon is used to simulate the contact API with predefined responses, allowing frontend and integration testing without depending on the live backend.

### Exploratory Automated UI Testing
A Playwright test suite was developed for the contact form as a learning exercise. Not currently integrated into the CI pipeline.

### CI Automation
A GitHub Actions workflow runs the Newman security regression suite on every push to `main`. Covers all stateless security boundaries (admin key enforcement, stateless input validation). Auth-dependent tests are excluded from CI due to JWT token expiry making static secret rotation impractical — these run locally before significant releases.

---

## 7. Bug Reporting

Bugs discovered during test runs are logged in Jira (project: QA Testing). Commit messages reference Jira ticket IDs to maintain traceability between code changes and reported issues.

**Bug report fields:**
- Summary
- Steps to reproduce
- Expected behavior
- Actual behavior
- Severity
- Environment (Local / Production)
- Fix applied and verification status

---

## 8. Known Limitations

- Contact API tests on Local do not verify database writes or email delivery (by design)
- Production contact form tests write real data to the database — use test data only
- Phone validation accepts any 10 or 11 digit number regardless of real-world validity
- Auth-dependent Newman tests require fresh JWT token values before each local run (7-day expiry)
- Script injection test cannot be automated — requires manual visual verification on /memories and DB cleanup
- Mobile testing currently limited to Chrome DevTools emulation — physical device testing not yet completed
- axe accessibility scans completed on home page only — dashboard, admin panel, and memories page not yet scanned

---

## 9. Future Improvements

- [x] Set up GitHub Actions to run Postman collections automatically on push to `main`
- [x] Newman CLI for command-line Postman collection runs
- [ ] Document forgot password flow test cases
- [ ] Formal QA documentation for memories system and review system (Layers 5–6)
- [ ] axe DevTools scans on remaining pages (dashboard, admin panel, memories)
- [ ] Mobile screen reader testing (TalkBack / VoiceOver)
- [ ] Physical device testing on contact form and navigation