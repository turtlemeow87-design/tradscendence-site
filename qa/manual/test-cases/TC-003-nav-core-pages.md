# Test Cases — Core Navigation
**Site:** https://www.soundbeyondborders.com  
**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Type:** Manual UI Test Cases

---

## TC-003 — Core Navigation

### TC-003-01 — Desktop Nav Links Route Correctly

**Priority:** High  
**Type:** Happy Path

**Preconditions:**
- Browser is open on a desktop viewport (1024px or wider)
- Site is loaded at `https://www.soundbeyondborders.com`

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Observe the header nav bar | Nav is visible with 5 links: Home, About, Contact / Booking, My Instruments, Memories |
| 2 | Click **About** | Page navigates to `/about` |
| 3 | Click **Contact / Booking** | Page navigates to `/contact` |
| 4 | Click **My Instruments** | Page navigates to `/instruments` |
| 5 | Click **Memories** | Page navigates to `/memories` |
| 6 | Click **Home** | Page navigates back to `/` |

**Expected Final Result:** All 5 nav links route to the correct pages. No broken links, no 404s, no unexpected redirects.

---

### TC-003-02 — Logo Routes to Home

**Priority:** Medium  
**Type:** Happy Path

**Preconditions:**
- Browser is open on any page other than Home

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/contact` | Contact page loads |
| 2 | Click the logo image in the header | Page navigates to `/` |

**Expected Final Result:** Clicking the logo from any page returns the user to the home page.

---

### TC-003-03 — @Tradscendence Handle Routes to Footer

**Priority:** Low  
**Type:** UI Behavior

**Preconditions:**
- Browser is open on the home page

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Locate the `@Tradscendence` link below the logo | Link is visible in italic rosewood text |
| 2 | Click the link | Page scrolls to the footer section |

**Expected Final Result:** Clicking `@Tradscendence` smoothly scrolls to the footer on the home page.

---

### TC-003-04 — Mobile Menu Opens and Closes

**Priority:** High  
**Type:** UI Behavior

**Preconditions:**
- Browser is at a mobile viewport (under 768px) or Chrome DevTools mobile emulation is active
- Site is loaded at `https://www.soundbeyondborders.com`

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Observe the header | Desktop nav is hidden, hamburger button is visible |
| 2 | Click the hamburger button | Mobile menu dropdown appears with 5 nav links |
| 3 | Observe the hamburger button | Button visually updates to reflect the open state |
| 4 | Click the hamburger button again | Mobile menu closes |
| 5 | Observe the hamburger button | Button visually updates to reflect the closed state |

**Expected Final Result:** Mobile menu toggles open and closed correctly. The hamburger button updates its label and state each time it is clicked.

**Accessibility Note:** The hamburger button uses accessibility attributes (`aria-expanded`, `aria-label`) that tell screen readers whether the menu is open or closed. These can be verified in Chrome DevTools → Elements panel if needed. See the accessibility note at the bottom of this file for more context.

---

### TC-003-05 — Mobile Menu Closes on Outside Click

**Priority:** Medium  
**Type:** UI Behavior

**Preconditions:**
- Browser is at a mobile viewport
- Mobile menu is currently open

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Open the mobile menu by clicking the hamburger button | Menu is visible |
| 2 | Click anywhere on the page outside the menu | Menu closes |
| 3 | Observe the hamburger button | Button updates to reflect the closed state |

**Expected Final Result:** Clicking outside the mobile menu dismisses it without navigating away from the page.

---

### TC-003-06 — Mobile Menu Closes on Escape Key

**Priority:** Medium  
**Type:** UI Behavior / Accessibility

**Preconditions:**
- Browser is at a mobile viewport
- Mobile menu is currently open

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Open the mobile menu | Menu is visible |
| 2 | Press the **Escape** key | Menu closes |
| 3 | Observe the hamburger button | Button updates to reflect the closed state |

**Expected Final Result:** Pressing Escape closes the mobile menu and resets the button state. This supports keyboard-only navigation for users who don't use a mouse.

---

### TC-003-07 — Mobile Menu Links Route Correctly

**Priority:** High  
**Type:** Happy Path

**Preconditions:**
- Browser is at a mobile viewport
- Mobile menu is open

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Open the mobile menu | All 5 nav links are visible: Home, About, Contact / Booking, My Instruments, Memories |
| 2 | Tap **About** | Page navigates to `/about` |
| 3 | Open menu again and tap **Contact / Booking** | Page navigates to `/contact` |
| 4 | Open menu again and tap **My Instruments** | Page navigates to `/instruments` |
| 5 | Open menu again and tap **Memories** | Page navigates to `/memories` |
| 6 | Open menu again and tap **Home** | Page navigates to `/` |

**Expected Final Result:** All mobile nav links route to the correct pages. No broken links or 404s.

---

### TC-003-08 — Future Nav Links Not Visible

**Priority:** Low  
**Type:** Validation

**Preconditions:**
- Browser is open on any page, both desktop and mobile viewports

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | Observe the desktop nav bar | Blog, Calendar, and Store links are not present |
| 2 | Switch to mobile viewport and open the hamburger menu | Blog, Calendar, and Store links are not present in the mobile menu either |

**Expected Final Result:** Future links (Blog, Calendar, Store) are intentionally hidden from both desktop and mobile navigation and should not appear in either.

---

## Notes

**Future pages:** Blog, Calendar, and Store are filtered out of the nav intentionally. Their direct URLs may or may not load anything — testing those is out of scope here.

**Accessibility and ARIA:** ARIA stands for Accessible Rich Internet Applications. It's a set of attributes that developers add to HTML elements to make websites usable for people who rely on screen readers — software that reads the page out loud for users who are blind or have low vision. A screen reader can't visually see that a menu is open or closed the way a sighted user can, so ARIA attributes like `aria-expanded` and `aria-label` communicate that state in text form. When the hamburger menu opens, `aria-expanded` switches to `true` and `aria-label` changes to "Close Menu" — that's what the screen reader announces to the user. Testing that these update correctly is part of making sure the site is accessible, not just visually functional.