
# Test Sessions — Admin Boundary Validation

Scope: TC-009
Date: 2026-03-04
Tester: Hunter Eastland
Environment: Production (Vercel + Neon)
Browser: Chromium / Incognito
Build / Version: Live site as of 2026-03-04

------------------------------------------------------------
Accounts Used
------------------------------------------------------------

User A (Attacker Simulation): theast.qa@gmail.com
User B (Normal User): huntereast.musiq@gmail.com

------------------------------------------------------------
Test Case Results
------------------------------------------------------------

TC-009-01 — Admin API Requires Valid Admin Key
Result: PASS

Actual:
- Request without admin key returned 401
- Request with invalid admin key returned 401
- Request with correct admin key returned 200
- Endpoint tested: /api/admin/reviews/list

------------------------------------------------------------

TC-009-02 — Authenticated User Cannot Access Admin API
Result: PASS

Actual:
- Logged in as normal user
- Attempted access to /api/admin/reviews/list → 401
- Attempted access to /api/admin/memories/list → 401

------------------------------------------------------------

TC-009-03 — Admin Mutation Endpoint Requires Valid Admin Key
Result: PASS

Actual:
- Endpoint tested: POST /api/admin/status/update
- No admin key → 404
- Invalid admin key → 404
- Valid admin key via admin UI → 200
- Status persisted after refresh → Yes

------------------------------------------------------------
Security Conclusions
------------------------------------------------------------

Admin endpoints correctly enforce privilege boundaries.
Unauthorized requests are denied before any sensitive
data is returned or mutated.
