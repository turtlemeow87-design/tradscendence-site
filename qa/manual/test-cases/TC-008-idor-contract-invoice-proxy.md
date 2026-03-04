# Test Cases — IDOR / Horizontal Access Control (Contracts, Invoices, Reviews, Signing)
**Area:** Client-facing document + review workflows  
**Author:** Hunter Eastland  
**Last Updated:** 2026-03-04  
**Type:** Manual Security Test Cases  

---

## TC-008-01 — User A Cannot View User B Contract PDF (IDOR)

**Priority:** Critical  
**Type:** Security / IDOR  

**Preconditions:**
- Two different user accounts exist: User A and User B
- User B has an uploaded contract available to view (a real contract record exists)
- You can obtain a User B contract `id` by logging in as User B and clicking “View PDF” once

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Login as User B | Dashboard loads |
| 2 | Click the contract “View PDF” button | PDF opens (baseline confirmation) |
| 3 | Copy the contract view URL path | URL looks like `/api/contracts/[id]/view` |
| 4 | Logout | Session cleared |
| 5 | Login as User A | Dashboard loads |
| 6 | Paste User B’s contract view URL into address bar | Request is blocked (NOT a PDF stream) |
| 7 | Verify Network response | Status is 403/404 (or equivalent denial), response is not `application/pdf` |

**Expected Final Result:** User A cannot access User B’s contract bytes through the proxy route.

---

## TC-008-02 — User A Cannot Download User B Invoice (IDOR)

**Priority:** Critical  
**Type:** Security / IDOR  

**Preconditions:**
- Same as TC-008-01, except User B has an invoice available to download
- You can obtain a User B invoice `id` by logging in as User B and clicking download once

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Login as User B | Dashboard loads |
| 2 | Click invoice download button | File download triggers (baseline confirmation) |
| 3 | Capture the invoice download URL path | URL looks like `/api/invoices/[id]/view` |
| 4 | Logout | Session cleared |
| 5 | Login as User A | Dashboard loads |
| 6 | Paste User B’s invoice view URL into address bar | Request is blocked (NOT a file download) |
| 7 | Verify Network response | Status is 403/404 (or equivalent denial) and no PDF bytes stream; response is not `Content-Disposition: attachment` with a PDF stream |

**Expected Final Result:** User A cannot download User B’s invoice via proxy route.

---

## TC-008-03 — Unauthenticated Access to Proxy Routes Is Blocked

**Priority:** High  
**Type:** Security / Access Control  

**Preconditions:**
- You have a known valid contract `id` and invoice `id` (from earlier baseline steps)
- No active session (Incognito recommended)

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/api/contracts/[id]/view` | Request is blocked |
| 2 | Navigate to `/api/invoices/[id]/view` | Request is blocked |
| 3 | Verify Network response codes | 401/403/404 (or equivalent), and not a PDF stream |

**Expected Final Result:** Proxy routes do not stream bytes without authentication.

---

## TC-008-04 — User A Cannot Submit Review for User B Booking (IDOR)

**Priority:** High  
**Type:** Security / Authorization (Ownership)  

**Endpoint:** `POST /api/reviews/submit`

**Preconditions:**
- User B has a **Complete** booking visible on `/dashboard`
- You can capture User B’s `submission_id` from DevTools → Network → Payload after User B submits a review

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Login as User B | Dashboard loads |
| 2 | Submit a valid review (10+ chars) | 200 OK and “submitted for approval” message |
| 3 | Capture `submission_id` from request payload | `submission_id` recorded for replay |
| 4 | Logout | Session cleared |
| 5 | Login as User A | Dashboard loads |
| 6 | Replay `POST /api/reviews/submit` with `submission_id` set to User B’s captured value | Request is denied (403/404 pattern), no review created |
| 7 | Verify in Admin Reviews queue | No new pending review exists for that booking from User A |

**Expected Final Result:** User A cannot create a review tied to User B’s booking.

---

## TC-008-05 — User A Cannot Sign User B Contract (IDOR)

**Priority:** Critical  
**Type:** Security / Authorization (Ownership)  

**Endpoint:** `POST /api/contracts/[id]/sign`

**Preconditions:**
- User B has a contract that is available to sign (Sign Contract flow available)
- You can capture User B’s contract `id` from DevTools → Network when initiating signing

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Login as User B | Dashboard loads |
| 2 | Initiate contract signing and capture request details | Sign request URL is `/api/contracts/[id]/sign` |
| 3 | Logout | Session cleared |
| 4 | Login as User A | Dashboard loads |
| 5 | Replay `POST /api/contracts/[UserB_id]/sign` using User B’s contract id and a valid payload | Request is blocked (403/404) |
| 6 | Verify signature did not apply | No change in signed state; no PDF stamp change; no DB audit trail for User A |

**Expected Final Result:** User A cannot sign User B’s contract.

