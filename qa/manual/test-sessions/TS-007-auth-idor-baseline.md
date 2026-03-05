# Test Sessions — Auth + IDOR Baseline

Scope: TC-007 + TC-008  
Date: 2026-03-03 to 2026-03-04  
Tester: Hunter Eastland  
Environment: Production (Vercel + Neon)  
Browser: Incognito (Avast Secure Browser / Chromium)  
Build / Version: Live site as of 2026-03-04  

------------------------------------------------------------
Accounts Used
------------------------------------------------------------

User A (Attacker Simulation): theast.qa@gmail.com  
User B (Target Account): huntereast.musiq@gmail.com  

Booking identifiers observed during testing (NOT user ids):
- submission_id: 83 (User B booking used for review baseline)
- submission_id: 84 (User A booking used for payload-shape capture)

Contract identifiers observed:
- contract_id: 11 (User B contract used for IDOR validation)

Invoice identifiers observed:
- invoice_id: 9 (User B invoice used for IDOR validation)

------------------------------------------------------------
Test Case Results
------------------------------------------------------------

TC-007-01 — Unauthenticated Access to /dashboard  
Result: PASS  
Actual: /dashboard redirected to /login?redirect=%2Fdashboard. No dashboard content rendered.

TC-007-02 — Authenticated User Cannot Access /login or /register  
Result: PASS  
Actual: 302 redirect to /dashboard. No content flash observed.

TC-007-03 — Logout Invalidates Session  
Result: PASS  
Actual: auth_token cookie removed; /dashboard redirected to /login.

TC-007-04 — Tampered JWT Cookie Blocks Access  
Result: PASS  
Actual: Modified auth_token invalidated session; /dashboard redirected to /login.

------------------------------------------------------------

TC-008-01 — User A Cannot View User B Contract (IDOR)  
Result: PASS  
Actual:  
- User B: /api/contracts/11/view returned 200 and rendered PDF.  
- User A: Same URL returned 403. No bytes streamed.

TC-008-02 — User A Cannot Download User B Invoice (IDOR)  
Result: PASS  
Actual:  
- User B: /api/invoices/9/view returned 200 with Content-Disposition: attachment.  
- User A: Same URL returned 403. No file download occurred.

TC-008-03 — Unauthenticated Access to Proxy Routes  
Result: PASS  
Actual:  
- Unauthenticated (incognito/no cookies) request to /api/contracts/11/view was blocked (403) and did not stream PDF bytes.  
- Unauthenticated (incognito/no cookies) request to /api/invoices/9/view was blocked (403) and did not stream PDF bytes or trigger a download.  


TC-008-04 — User A Cannot Submit Review for User B Booking (IDOR)  
Result: PASS  
Actual:  
- User B submitted review with submission_id 83 → 200 OK.  
- User A replayed POST /api/reviews/submit with submission_id 83.  
- Response: 404 { "error": "Booking not found" }.  
- Admin Reviews drawer confirmed no cross-user review was created.

TC-008-05 — User A Cannot Sign User B Contract (IDOR)  
Result: PASS  
Actual:  
- User B baseline: POST /api/contracts/11/sign returned 200 when signed legitimately.  
- User A replayed POST /api/contracts/11/sign with valid payload.  
- Response: 403 { "error": "Access denied" }.  
- Contract state unchanged; no unauthorized signing recorded.

------------------------------------------------------------
Security Conclusions (Session Summary)
------------------------------------------------------------

1. Middleware correctly enforces authentication for protected routes.
2. JWT integrity validation prevents tampered-cookie access.
3. Contract proxy enforces ownership before streaming Blob bytes.
4. Invoice proxy enforces ownership before attachment download.
5. Reviews endpoint enforces booking ownership (secure not-found pattern).
6. Contract signing endpoint enforces ownership (explicit 403 Access denied).
7. No horizontal privilege escalation observed across tested surfaces.

------------------------------------------------------------
Artifacts Captured
------------------------------------------------------------

- Redirect + cookie validation screenshots (TC-007)
- 403 evidence for contract proxy
- 403 evidence for invoice proxy
- 404 Booking not found evidence for review IDOR replay
- 403 Access denied evidence for contract signing IDOR
- Admin drawer screenshots confirming no side effects

End of Session 1 (Auth + IDOR Baseline Hardening)
