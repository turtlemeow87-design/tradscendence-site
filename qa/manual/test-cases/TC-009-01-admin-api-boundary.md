# Test Cases — Admin API Authorization Boundary
**Area:** Admin API / Privilege Boundary  
**Author:** Hunter Eastland  
**Last Updated:** 2026-03-04  
**Type:** Manual Security Test Cases  

---

## TC-009-01 — Admin API Requires Valid Admin Key

**Priority:** Critical  
**Type:** Security / Authorization  

**Preconditions:**
- The site is running in production
- Admin endpoints exist under `/api/admin/*`
- You know the real `ADMIN_API_KEY` used by the admin panel
- DevTools Network tab is available

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Open a new Incognito window (no admin panel unlocked) | Clean session |
| 2 | Navigate to `/api/admin/reviews/list` directly | Request blocked |
| 3 | Observe Network response | Status is 401/403 and no admin data returned |
| 4 | Send same request with an **incorrect admin key** header | Request blocked |
| 5 | Observe Network response | Status is 401/403 |
| 6 | Unlock admin panel normally using correct key | Admin UI loads |
| 7 | Trigger same endpoint again via admin UI | Status 200 with valid JSON response |

**Expected Final Result:**  
Admin endpoints are inaccessible without the correct `ADMIN_API_KEY` and return a denial status. Only requests containing the correct key succeed.
