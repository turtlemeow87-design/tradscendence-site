# Test Session — Database Validation: contact_submissions
**Session ID:** TS-002  
**Test Cases Covered:** TC-002-DB-001, TC-002-DB-002, TC-002-DB-003, TC-002-DB-004  
**Author:** Hunter Eastland  
**Date:** February 23, 2026  
**Time:** ~2:00 PM EST  
**Environment:** Production (Neon SQL Editor — `neondb`)  
**Tool:** Neon SQL Editor  

---

## Session Goal
Run all four database validation test cases against the live `contact_submissions` table to verify that form submissions are writing correctly to the database and that data integrity constraints are holding.

---

## Results Summary

| Test Case | Description | Result |
|---|---|---|
| TC-002-DB-001 | Most recent submissions | ✅ Pass |
| TC-002-DB-002 | Verify specific submission by email | ✅ Pass |
| TC-002-DB-003 | NULL check on required fields | ✅ Pass |
| TC-002-DB-004 | Duplicate submission detection | ✅ Pass |

---

## Session Notes

**TC-002-DB-001 — Most Recent Submissions**  
Query returned rows ordered correctly by `created_at` descending. All required fields (`id`, `name`, `email`) were populated across returned rows. No unexpected NULLs observed.

**TC-002-DB-002 — Verify Specific Submission by Email**  
Queried by a known test email. One row returned with all field values matching what was entered in the form. Instruments array data was also verified — single instruments stored as `{Tanpura}`, multiple instruments stored as `{Tanpura,Esraj}`, and empty selections stored as `{}`. All correct.

**TC-002-DB-003 — NULL Check on Required Fields**  
Query returned zero rows, confirming that `name`, `email`, `location`, and `message` have no NULL values across all records in the table. `NOT NULL` constraints are holding as expected.

**TC-002-DB-004 — Duplicate Submission Detection**  
Query ran successfully. Some duplicate emails were present in the table from prior test submissions, which is expected behavior — the form allows multiple submissions from the same email address. No accidental rapid duplicates (e.g. multiple submissions within seconds) were observed.

---

## Cleanup
Real data and test data rows were deleted by email using `DELETE FROM contact_submissions WHERE email = '...'` after confirming target rows with a SELECT preview first. Table left in a clean state after session.

---

## Bugs Filed
None.

---

## Overall Result
✅ All test cases passed. Data is writing to the database correctly, required field constraints are holding, and array fields are storing single and multi-select values as expected.