# Bug Report — BR-005
**Site:** https://www.soundbeyondborders.com  
**Author:** Hunter Eastland  
**Date Filed:** February 23, 2026  
**Status:** Open  

---

## Summary
The "Book me" button on the home page fails the WCAG 2.1 AA minimum color contrast requirement. The ivory text on a gold background does not provide enough contrast to be easily readable for users with low vision or color perception differences.

---

## Environment
| Field | Details |
|---|---|
| URL | https://www.soundbeyondborders.com |
| Browser | Chrome |
| OS | Windows |
| Tool | axe DevTools (Chrome Extension) |
| Standard | WCAG 2.1 AA |
| Found on | February 23, 2026 at 4:16 PM |

---

## Element
```html
<button id="open-book" class="rounded-2xl shadow-soft px-4 py-2 font-semibold bg-gold text-ivory hover:bg-golddark hover:text-rosewood focus:outline-none frame">
  Book me
</button>
```

---

## Steps to Reproduce
1. Navigate to `https://www.soundbeyondborders.com`
2. Open Chrome DevTools → axe DevTools tab
3. Run a full page scan
4. Expand "Elements must meet minimum color contrast ratio thresholds"
5. Observe the "Book me" button flagged with insufficient contrast

---

## Expected Result
Text on the "Book me" button should have a contrast ratio of at least 4.5:1 against its background color per WCAG 2.1 AA standards.

## Actual Result
The button has a contrast ratio of 2.12:1 — foreground color `#f5f1e8` (ivory) against background color `#c2a45f` (gold) at 16px normal weight. This falls well short of the required 4.5:1 ratio.

---

## Impact
**Serious** — Users with low vision or color blindness may have difficulty reading the button text. The button is a shortcut for submitting a quick booking inquiry directly from the home page without navigating to the full contact page.

---

## Notes
- The other 5 issues flagged in the same axe scan are originating from an embedded YouTube player and are not fixable from within this codebase.
- A fix would involve darkening either the button background color or switching the text to a darker color with sufficient contrast against gold. The hover state (`hover:text-rosewood`) should also be checked for contrast once the base state is fixed.

---

## Priority
**Medium** — Does not break functionality but affects accessibility compliance and impacts the most prominent button on the home page.