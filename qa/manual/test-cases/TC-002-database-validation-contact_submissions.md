# Test Cases — Database Validation: contact_submissions
**Table:** `contact_submissions`  
**Database:** Neon PostgreSQL (via Vercel)  
**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Type:** Manual Database Validation Test Cases  

---

## TC-002-DB-001 — Verify Most Recent Submissions

**Priority:** Medium  
**Type:** Data Validation

**Preconditions:**
- Access to Neon SQL Editor or a connected SQL client
- At least one submission exists in `contact_submissions`

**Query:**
```sql
SELECT id, name, email, created_at
FROM contact_submissions
ORDER BY created_at DESC LIMIT 5;
```

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Open Neon SQL Editor | Editor is connected to `neondb` |
| 2 | Run the query above | Up to 5 rows are returned |
| 3 | Check the `created_at` values | Rows are ordered newest first |
| 4 | Check that `id`, `name`, and `email` are populated | No unexpected NULL values in these columns |

**Expected Final Result:** Rows come back sorted by most recent timestamp with all required fields populated. This is a good first check to run after any test form submission.

---

## TC-002-DB-002 — Verify a Specific Submission by Email

**Priority:** High  
**Type:** Data Integrity

**Preconditions:**
- A form submission was just made using a known test email address
- Access to Neon SQL Editor

**Query:**
```sql
SELECT * FROM contact_submissions
WHERE email = 'test@example.com';
```
*(Replace `test@example.com` with the actual email used during the test)*

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Submit the contact form using a known test email | Form redirects to `/thanks` |
| 2 | Run the query above in Neon SQL Editor | One row is returned |
| 3 | Check that `name` matches what was entered | Values match exactly |
| 4 | Check that `email` matches what was entered | Values match exactly |
| 5 | Check that `location` and `message` match what was entered | Values match exactly |
| 6 | Check that `created_at` has a recent timestamp | Timestamp reflects the time of submission |

**Expected Final Result:** Exactly one row comes back with all field values matching what was entered in the form. Nothing should be truncated or stored in the wrong column.

---

## TC-002-DB-003 — NULL Check on Required Fields

**Priority:** High  
**Type:** Data Integrity

**Preconditions:**
- Access to Neon SQL Editor

**Query:**
```sql
SELECT id, name, email, location, message
FROM contact_submissions
WHERE name IS NULL
   OR email IS NULL
   OR location IS NULL
   OR message IS NULL;
```

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Run the query above | Query executes without error |
| 2 | Check the result set | Zero rows are returned |

**Expected Final Result:** No rows come back. These four fields are marked `NOT NULL` in the schema, so they should always have a value. If this query ever returns anything, something slipped past validation and it should be filed as a bug.

---

## TC-002-DB-004 — Duplicate Submission Detection

**Priority:** Medium  
**Type:** Data Integrity

**Preconditions:**
- Access to Neon SQL Editor

**Query:**
```sql
SELECT email, COUNT(*)
FROM contact_submissions
GROUP BY email
HAVING COUNT(*) > 1;
```

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Run the query above | Query executes without error |
| 2 | Review the result set | See note below |

**Expected Final Result:** Multiple submissions from the same email are allowed — someone could legitimately book multiple events over time. This query is more of a spot check for accidental duplicates, like if the form got stuck and the submit button was hit several times in a row and all of them went through. If you see the same email submitted multiple times within seconds of each other, that's worth investigating.

---

## Cleanup

After any test submissions, use the following to remove test data. Always run the SELECT first to preview what will be deleted before running the DELETE.

**Preview:**
```sql
SELECT * FROM contact_submissions
WHERE email = 'test@example.com';
```

**Delete:**
```sql
DELETE FROM contact_submissions
WHERE email = 'test@example.com';
```