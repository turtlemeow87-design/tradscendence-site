## Excluded from Automated Run

**Reviews - Script Injection in Body (Observation)**
- Location: Security Regression > 07 - Input Validation
- Reason: Stateful test (writes to DB on each run, requires manual cleanup) 
  and requires visual verification on /memories page that cannot be asserted 
  programmatically.
- Manual test only — run before releases, verify output escaping on /memories 
  after approving the review in admin panel, then delete the review from DB.