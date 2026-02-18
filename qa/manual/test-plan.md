# Test Plan — Sound Beyond Borders (soundbeyondborders.com)

**Project:** Sound Beyond Borders — Music Booking Website  
**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Status:** Active  

---

## 1. Overview

This test plan covers API-level functional testing for the Sound Beyond Borders music booking website. The site is built with Astro (TypeScript), uses a Neon PostgreSQL database, and deploys via Vercel. Testing is performed using Postman for automated API tests and Mockoon for mock server simulation.

---

## 2. Scope

### In Scope
- Instruments API endpoints (GET, POST, DELETE)
- Contact/Booking form API endpoint (POST)
- Input validation and error handling
- Authentication on protected admin routes
- Response structure and data integrity

### Out of Scope
- Frontend UI/visual testing (covered separately by Playwright)
- Performance/load testing
- Third-party services (Resend email, Neon database internals)

---

## 3. Test Environments

| Environment | Base URL | When Used |
|---|---|---|
| Local | `http://localhost:4321` | Active development, manual runs |
| Production | `https://www.soundbeyondborders.com` | Post-deployment verification |

> **Note:** In the Local environment, the contact API skips database inserts and email sends by design (development mode flag). Production runs trigger real database writes and Resend email notifications.

Environments are managed as Postman Environment variables using `{{base_url}}` across all requests, allowing seamless switching without modifying individual requests.

---

## 4. Tools

| Tool | Purpose |
|---|---|
| Postman | API test authoring, collection runner, environment management |
| Mockoon | Mock server simulating contact API responses for isolated testing |
| Jira | Bug tracking and test issue management (project: QA Testing / SCRUM) |
| GitHub | Version control, test artifact storage |
| Playwright | End-to-end UI automation (separate test suite) |
| Newman | CLI runner for Postman collections (for future CI/CD integration) |

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

**Total Tests:** Assertions across 8 requests  
**Status:** ✅ All passing (Local)

---

## 6. Test Approach

### Functional Testing
Each API endpoint is tested for correct HTTP status codes, response structure (JSON shape), and field-level validation. Tests are written as Postman post-response scripts using the `pm.test()` and `pm.expect()` assertion library.

### Positive Testing (Happy Path)
Verify that valid, well-formed requests return expected success responses with correct data shapes.

### Negative Testing (Validation & Edge Cases)
Verify that invalid inputs are correctly rejected with appropriate error codes and descriptive error messages.

### Mock Testing
Mockoon is used to simulate the contact API with predefined responses, allowing frontend and integration testing without depending on the live backend.

---

## 7. Bug Reporting

Bugs discovered during test runs are logged in Jira (project: QA Testing). The Postman → Jira integration is configured to automatically create issues when collection runs report failures.

**Bug report fields:**
- Summary
- Steps to reproduce
- Expected behavior
- Actual behavior
- Severity
- Environment (Local / Production)
- Link to Postman run report

---

## 8. Known Limitations

- Scheduled automated runs require a Postman paid plan — currently running manually
- Contact API tests on Local do not verify database writes or email delivery (by design)
- Production contact form tests write real data to the database — use test data only
- Phone validation accepts any 10 or 11 digit number regardless of real-world validity

---

## 9. Future Improvements

- [ ] Set up Newman + GitHub Actions for automated runs on merge to `main`
- [ ] Add Postman tests for blog, calendar, and store endpoints when built
- [ ] Add contract testing to verify API responses match frontend expectations
- [ ] Configure a staging environment (`staging.soundbeyondborders.com`) for pre-production testing