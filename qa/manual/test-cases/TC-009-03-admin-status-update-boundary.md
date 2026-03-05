# Test Cases — Admin API Authorization Boundary
**Area:** Admin API / Privilege Boundary  
**Author:** Hunter Eastland  
**Last Updated:** 2026-03-04  
**Type:** Manual Security Test Cases  

---

## TC-009-03 — Admin Mutation Endpoint Requires Valid Admin Key (Status Update)

**Priority:** Critical  
**Type:** Security / Authorization  

**Endpoint:** `POST /api/admin/status/update`

**Preconditions:**
- At least one booking/submission exists in the admin panel (any status)
- You can obtain a valid `submission_id` from the admin panel payloads or UI
- DevTools Network tab is available

**Test Data:**
- submission_id: ______
- new_status: `Reviewing` (or any valid status value)

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Open a new Incognito window (no cookies) | Clean session |
| 2 | Attempt `POST /api/admin/status/update` **without** admin key using a valid payload | Request blocked |
| 3 | Observe Network response | Status is 401/403 |
| 4 | Confirm data integrity | Booking status does **not** change in admin UI |
| 5 | Attempt same request with an **invalid** admin key | Request blocked |
| 6 | Observe Network response | Status is 401/403 |
| 7 | Unlock admin panel using correct key | Admin UI loads |
| 8 | Trigger a status change via the admin UI dropdown + Save | Request succeeds |
| 9 | Observe the corresponding `POST /api/admin/status/update` request in Network | Status is 200 (or success response) |
| 10 | Confirm persistence | Refresh admin page; status remains updated |

**Expected Final Result:**  
Admin mutation endpoints cannot be executed without a valid `ADMIN_API_KEY`. Unauthorized requests are rejected and do not mutate data.
