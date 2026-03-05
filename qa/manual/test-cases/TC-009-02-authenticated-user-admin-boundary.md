# Test Cases — Admin API Authorization Boundary
**Area:** Admin API / Privilege Boundary  
**Author:** Hunter Eastland  
**Last Updated:** 2026-03-04  
**Type:** Manual Security Test Cases  

---

## TC-009-02 — Authenticated User Cannot Access Admin API

**Priority:** Critical  
**Type:** Security / Authorization  

**Preconditions:**
- A normal user account exists (User A or User B)
- You are logged in as that user
- The admin panel is NOT unlocked
- DevTools Network tab is available

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Login as a normal user (User A or User B) | Dashboard loads |
| 2 | Open DevTools → Network tab | Requests visible |
| 3 | Navigate directly to `/api/admin/reviews/list` in the browser | Request blocked |
| 4 | Observe Network response | Status is 401/403 |
| 5 | Verify response body | No admin JSON data returned |
| 6 | Repeat with `/api/admin/memories/list` | Request blocked |
| 7 | Observe Network response | Status is 401/403 |

**Expected Final Result:**  
Normal authenticated users cannot access any `/api/admin/*` endpoints unless the correct `ADMIN_API_KEY` is provided.
