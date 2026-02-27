# Test Cases — Media Playback (Basic Audio)

**Feature:** Audio teaser playback  
**Page(s):**
- https://www.soundbeyondborders.com/instruments/
- https://www.soundbeyondborders.com/ (Featured Sounds section)

**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Status:** In Progress

---

## Behavior Notes (Read Before Testing)

Audio playback behavior differs by device type and page:

- **Desktop — /instruments page:** Hovering over the ▶︎ button is the primary trigger. Audio stops automatically when the cursor leaves the button (by design). Click also triggers playback and restarts mid-play.
- **Desktop — Homepage Featured Sounds:** Click is the trigger. Audio continues playing after mouse leaves and persists across tab switches (by design).
- **Mobile:** Hover is not supported on any page. Tap/click is the only trigger everywhere.
- **Known browser limitation:** Modern browsers block audio until the user has made at least one click/tap on the page. On desktop, hover-to-play on /instruments is silently blocked on first page load until an initial click occurs. Tracked as BR-007.

---

## TC-004-01 — Hover Triggers Audio Playback (Desktop — /instruments only)

**Type:** Happy Path  
**Priority:** High  
**Environment:** Desktop only

**Preconditions:**
- Browser tab is active
- Device volume is on and not muted
- User is on the /instruments page on a desktop/laptop with a mouse
- User has already made at least one click anywhere on the page (see BR-007)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/instruments` | Instrument list loads with ▶︎ button next to each instrument name |
| 2 | Make one click anywhere on the page to unlock browser audio policy | No visible change; audio policy unlocked |
| 3 | Hover the mouse over the ▶︎ button next to any instrument | Audio begins playing within 1–2 seconds |
| 4 | Move the mouse away from the button | Audio stops immediately |
| 5 | Hover over a different instrument's ▶︎ button | New audio begins; previous does not resume |

**Expected Result:** Hovering starts audio, un-hovering stops it.  
**Pass Criteria:** Audio responds to hover within 2 seconds after initial click unlock, stops on mouse leave, no console errors.  
**Fail Criteria:** Audio does not play on hover even after initial click unlock, continues after mouse leaves, or page disrupted.

**Known Issue:** BR-007 — hover does not trigger audio on first page load before any click has occurred. Step 2 is a workaround until BR-007 is resolved.

---

## TC-004-02 — Click/Tap as Primary Trigger (Desktop + Mobile)

**Type:** Happy Path  
**Priority:** High  
**Environment:** Desktop and Mobile

**Context:**  
On **mobile**, tap is the *only* way to trigger audio. This test case verifies tap works correctly as a standalone trigger on mobile.  
On **desktop**, click serves as both the initial unlock for browser audio policy (see BR-007) and as a mid-play restart — clicking a playing instrument's button restarts it from the beginning.

**Steps — Mobile:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/instruments` on a mobile device | Instrument list loads with ▶︎ button next to each name |
| 2 | Tap the ▶︎ button next to any instrument | Audio begins playing within 1–2 seconds |
| 3 | Observe the page while audio plays | No page reload or navigation occurs |
| 4 | Wait for audio to finish | Audio stops naturally |
| 5 | Tap ▶︎ on a second instrument while first is still playing | First audio stops; second begins |

**Steps — Desktop (click restart behavior):**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Hover over any ▶︎ button to begin audio playback | Audio plays |
| 2 | While audio is playing, click the same ▶︎ button | Audio restarts from the beginning |
| 3 | While audio is playing, click a *different* ▶︎ button | First audio stops; second begins from start |

**Expected Result:** Tap is a fully functional standalone trigger on mobile. Click restarts audio on desktop.  
**Pass Criteria:** Audio plays within 2 seconds of tap on mobile; click correctly restarts on desktop. No console errors.  
**Fail Criteria:** Tap produces no audio on mobile, or click does not restart audio on desktop.

---

## TC-004-03 — Only One Audio Plays at a Time (Desktop + Mobile)

**Type:** UI Behavior  
**Priority:** High  
**Environment:** Desktop and Mobile

**Preconditions:**
- User is on the /instruments page or homepage Featured Sounds section
- At least two instruments are available with audio teasers

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Click/tap ▶︎ on the first instrument | First audio begins playing |
| 2 | Wait 1–2 seconds, then click/tap ▶︎ on a second instrument | First audio stops; second audio begins |
| 3 | Observe that only one audio source is active | No overlapping audio |

**Expected Result:** Previous audio stops when a new one is triggered under normal switching speed.  
**Pass Criteria:** Only one audio track plays at any time.  
**Fail Criteria:** Multiple audio tracks play simultaneously.

**Known Issue:** BR-009 — rapid sequential switching between Featured Sound tracks on the homepage can trigger an AbortError race condition where the second track fails to play. Intermittent; recovers on retry.

---

## TC-004-04 — Audio Playback on Homepage Featured Sounds (Desktop + Mobile)

**Type:** Happy Path  
**Priority:** Medium  
**Environment:** Desktop and Mobile

**Preconditions:**
- User is on the homepage `/`
- Device volume is on

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/` and scroll to the "Featured Sounds" section | Three instrument cards visible (Surbahar, Baglama Saz, Arabic Oud) |
| 2 | Click/tap the ▶︎ button on any featured card | Audio teaser begins playing |
| 3 | Wait 1–2 seconds, then click/tap ▶︎ on a different featured card | First stops, second plays |

**Expected Result:** Featured sound audio plays correctly; mutual exclusion works under normal usage speed.  
**Pass Criteria:** All three teasers play correctly when switched at normal speed.  
**Fail Criteria:** Audio missing, overlapping, or card non-responsive under normal switching.

---

## TC-004-05 — REMOVED

**Reason:** Original test was "Audio Stops When Tab Becomes Hidden." Removed because:
- On /instruments, hover-based audio stops when mouse leaves the button — tab switching is irrelevant by design.
- On homepage Featured Sounds, audio continuing across tab switches is intentional behavior.
- No defect condition exists to test.

---

## TC-004-06 — Graceful Failure on Broken Audio Source (Desktop)

**Type:** Edge Case  
**Priority:** Low  
**Environment:** Desktop

**Preconditions:**
- DevTools open on the /instruments page or homepage

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open DevTools → three-dot menu (⋮) → More tools → Network request blocking | Network request blocking panel opens |
| 2 | Check "Enable network request blocking", click + and enter the full URL of any `.m4a` file (e.g. `www.soundbeyondborders.com/media/baglamasaz1.m4a`) | URL added to block list |
| 3 | Hard refresh the page (Ctrl+Shift+R) | Page reloads; blocked file will now fail to load |
| 4 | Click/hover ▶︎ on the blocked instrument | No audio plays |
| 5 | Observe the page and console | No visible crash or error to user; console may log a warning |
| 6 | Click/hover ▶︎ on a different, non-blocked instrument | Audio plays normally |
| 7 | Uncheck "Enable network request blocking" and hard refresh when done | Normal behavior restored |

**Expected Result:** Broken audio fails silently without affecting the rest of the page.  
**Pass Criteria:** Page remains functional after failed playback attempt; other instruments still work.  
**Fail Criteria:** Page crashes, other buttons stop working, or unhandled error visible to user.

---

## Notes

- Audio files are `.m4a` format served from `/media/` on the Vercel deployment
- Desktop /instruments uses `mouseenter`/`mouseleave` for hover-to-play; homepage Featured Sounds and all mobile use `click` only
- Hover vs. click detection uses `window.matchMedia('(hover: hover)')`
- Playback logic uses a shared `players` Map to enforce single-track playback
- Known intermittent server-side glitch (non-reproducible, similar to BR-004) — retry before logging if audio fails unpredictably
- Video playback (YouTubeFacade, instrument page videos) is out of scope for TC-004 and will be covered in a future test case