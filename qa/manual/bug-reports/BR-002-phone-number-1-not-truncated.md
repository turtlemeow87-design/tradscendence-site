# BUG-002 — Phone Number Leading "1" Not Stripped

**Date Filed:** 2026-02-19
**Filed By:** Hunter Eastland
**Status:** Resolved
**Priority:** Medium
**Related Test Case:** TC-003
**Related Ticket:** SCRUM-8

---

## Summary
Entering an 11-digit phone number starting with "1" (US country code) does not strip the leading digit — instead it truncates at 10 digits, resulting in an incorrect area code.

## Environment
- **URL:** https://www.soundbeyondborders.com/contact
- **Browser:** Chrome
- **Type:** UI Behavior / Input Formatting

## Steps to Reproduce
1. Navigate to `/contact`
2. Click the **Phone** field
3. Type `18045551234`

## Expected Result
Leading `1` is recognized as a country code and stripped, field formats to `(804) 555-1234`

## Actual Result
Leading `1` is retained and truncated at 10 digits, field formats to `(180) 455-5123`

## Fix Applied
Added a condition in `contact.astro` to strip a leading `1` when input is 11 digits before formatting is applied.

## Verification
Confirmed fixed in Session 002 — typing `18045551234` now correctly formats to `(804) 555-1234`