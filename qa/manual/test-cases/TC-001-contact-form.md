# Test Cases — Contact / Booking Form
**Page:** https://www.soundbeyondborders.com/contact  
**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Type:** Manual UI Test Cases  

---

## TC-001 — Successful Full Booking Submission

**Priority:** High  
**Type:** Happy Path  

**Preconditions:**
- Browser is open on the Contact / Booking page
- All fields are visible and form is in default state

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/contact` | Page loads, form is visible with all fields |
| 2 | Enter "Hunter Eastland" in the **Your name** field | Text appears in the field |
| 3 | Enter "hunter@example.com" in the **Email** field | Text appears in the field |
| 4 | Enter "8045551234" in the **Phone** field | Field auto-formats to `(804) 555-1234` |
| 5 | Click the **Event date** field and select a date at least 1 month out | Date appears in the field |
| 6 | Enter "Richmond, VA" in the **Location** field | Text appears in the field |
| 7 | Click the **Instrument(s)** dropdown | Dropdown opens showing all 17 instruments |
| 8 | Check "Turkish Oud" and "Duduk" | Pills appear below dropdown showing selected instruments, counter shows "2 selected" |
| 9 | Click outside the dropdown | Dropdown closes, pills remain visible |
| 10 | Click the **Genre(s)** dropdown | Dropdown opens showing all 8 genres |
| 11 | Check "Classical" | Pill appears, counter shows "1 selected" |
| 12 | Click outside the dropdown | Dropdown closes, pill remains visible |
| 13 | Enter "I'd like to book you for a wedding ceremony." in the **Message** field | Text appears in the field |
| 14 | Click **Send** | Button text changes to "Sending...", button is disabled |
| 15 | Wait for response | Page redirects to `/thanks` |

**Expected Final Result:** User is redirected to the `/thanks` page confirming submission was received.

---

## TC-002 — Submit with Missing Required Fields

**Priority:** High  
**Type:** Validation

**Preconditions:**
- Browser is open on the Contact / Booking page
- Form is in default empty state

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/contact` | Page loads with empty form |
| 2 | Leave all fields empty | No changes |
| 3 | Click **Send** | browser displays native validation tooltip on the first empty required field |
| 4 | Observe page behavior | Page scrolls smoothly to the first empty required field, visible belabove the sticky header |
| 5 | Confirm Submit button is re-enabled | Button text returns to "Send" and is clickable |

**Expected Final Result:** Validation tooltip appears on first required field. Page does not redirect. Form remains filled with any data the user entered.

---

## TC-003 — Phone Number Auto-Formatting

**Priority:** Medium  
**Type:** UI Behavior

**Preconditions:**
- Browser is open on the Contact / Booking page

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Click the **Phone** field | Field is focused, placeholder shows `(804) 555-1234` |
| 2 | Type `8045551234` | Field auto-formats in real time to `(804) 555-1234` |
| 3 | Clear the field and type `18045551234` | Field formats to `(804) 555-123` (truncates at 10 digits) |
| 4 | Clear the field and type `804` | Field formats to `(804) ` |
| 5 | Clear the field and type `804555` | Field formats to `(804) 555` |

**Expected Final Result:** Phone field correctly auto-formats digits as the user types and truncates at 10 digits.

---

## TC-004 — Instrument Multi-Select with Pills

**Priority:** Medium  
**Type:** UI Behavior

**Preconditions:**
- Browser is open on the Contact / Booking page

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Click the **Instrument(s)** dropdown button | Dropdown opens showing list of 17 instruments |
| 2 | Click anywhere outside the dropdown | Dropdown closes |
| 3 | Click the dropdown again | Dropdown reopens |
| 4 | Check "Turkish Oud" | Pill labeled "Turkish Oud" appears below dropdown, counter shows "1 selected" |
| 5 | Check "Duduk" | Second pill appears, counter shows "2 selected" |
| 6 | Click the × button on the "Turkish Oud" pill | Turkish Oud pill disappears, checkbox is unchecked, counter shows "1 selected" |
| 7 | Uncheck "Duduk" via the dropdown | Duduk pill disappears, placeholder resets to "Select instruments..." |

**Expected Final Result:** Pills correctly reflect selected instruments, removing a pill unchecks the corresponding checkbox, and the dropdown counter updates in real time.

---

## TC-005 — "Other" Genre Reveals Custom Text Field

**Priority:** Medium  
**Type:** UI Behavior

**Preconditions:**
- Browser is open on the Contact / Booking page

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Confirm the **Describe the genre(s) / vibe** textarea is not visible | Textarea is hidden |
| 2 | Click the **Genre(s)** dropdown | Dropdown opens |
| 3 | Check "Other" | Dropdown shows "Other" checked AND a new textarea labeled "Describe the genre(s) / vibe" appears below the dropdown |
| 4 | Enter "Mystical Ambient" in the textarea | Text appears |
| 5 | Uncheck "Other" in the dropdown | Textarea disappears |
| 6 | Check "Other" | Dropdown shows "Other" checked AND text area reappears |
| 7 | Click "x" to remove "other" pill | Testarea disappears again |

**Expected Final Result:** The custom genre textarea only appears when "Other" is selected and disappears when "Other" is deselected.

---

## TC-006 — Invalid Email Format

**Priority:** High  
**Type:** Validation

**Preconditions:**
- Browser is open on the Contact / Booking page

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Fill in all required fields with valid data | Fields populated |
| 2 | Clear the **Email** field and enter `not-an-email` | Text appears in field |
| 3 | Click **Send** | Browser displays native validation tooltip on the email field |
| 4 | Read the tooltip message | Tooltip specifically mentions the email format is invalid (missing '@') |

**Expected Final Result:** Form does not submit. Browser native validation tooltip appears on the email field explaining the format error.

**Expected Final Result:** Form does not submit, error banner mentions the email field specifically.

---

## TC-007 — Email Link Alternative

**Priority:** Low  
**Type:** UI Behavior

**Preconditions:**
- Browser is open on the Contact / Booking page

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Locate the text "Or ... Don't want to use the form? Just click here and email me." at the bottom of the form | Link is visible next to the Send button |
| 2 | Click the link | Default email client opens with Hunter's email address pre-filled in the To field |

**Expected Final Result:** Clicking the link opens the user's email client with the correct recipient address pre-populated.

---

## TC-008 — Form State After Failed Submission

**Priority:** Medium  
**Type:** Validation

**Preconditions:**
- Browser is open on the Contact / Booking page

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Fill in name, email, and message but leave **Location** empty | Three fields populated |
| 2 | Click **Send** | Native browser tooltip appears mentioning location is required |
| 3 | Confirm the name, email, and message fields still contain the data entered | Previously entered data is preserved |
| 4 | Confirm the Submit button is re-enabled | Button shows "Send" and is clickable |
| 5 | Fill in the **Location** field | Field populated |
| 6 | Click **Send** again | Form submits successfully, redirects to `/thanks` |

**Expected Final Result:** Form preserves user input after a failed submission and allows resubmission after fixing the error.
