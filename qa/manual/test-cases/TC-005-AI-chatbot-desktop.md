# Test Cases — AI Chatbot: Desktop

**Feature:** InstrumentChat AI Component  
**Page(s):**
- https://www.soundbeyondborders.com/ (homepage chat widget)
- https://www.soundbeyondborders.com/instruments/[slug] (individual instrument pages)

**Author:** Hunter Eastland  
**Last Updated:** February 2026  
**Status:** Complete

---

## Behavior Notes (Read Before Testing)

The AI chat widget is embedded on the homepage and individual instrument pages. It's only supposed to answer questions about world and folk instruments — questions about booking, pricing, or anything unrelated should get a polite redirect. On individual instrument pages, the opening greeting should already reference the instrument on that page without the user having to mention it. Conversation history carries through the session; refreshing the page resets it.

---

## TC-005-01 — Off-Topic Question Gets Redirected

**Type:** Negative  
**Priority:** High  
**Environment:** Desktop

**Preconditions:**
- Site is live and accessible
- Chat widget visible on the home page

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to the home page | Chat widget visible below the featured instruments section |
| 2 | Type "When do donkeys fly?" into the input and send | Message sends; thinking indicator appears briefly |
| 3 | Observe the response | Bot does not answer the question; redirects warmly back to instrument topics |

**Expected Result:** Bot acknowledges it can't help with that and steers back to instruments.  
**Pass Criteria:** Response is a redirect with no attempt to answer the question. No error displayed.  
**Fail Criteria:** Bot answers the question, throws an error, or produces no response.

---

## TC-005-02 — Instrument Page Greeting References the Right Instrument

**Type:** Happy Path  
**Priority:** High  
**Environment:** Desktop

**Preconditions:**
- Navigate to an individual instrument page (e.g. `/instruments/Surbahar`)
- Chat widget visible on the page

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to the Surbahar instrument page | Page loads; chat widget visible |
| 2 | Read the bot's opening message without sending anything | Opening message references the Surbahar by name |
| 3 | Type "Where does this instrument come from?" and send — do not name the instrument | Bot responds |
| 4 | Observe the response | Bot answers about the Surbahar's origins without the user having named it |

**Expected Result:** Bot greets with instrument-specific context and follows up correctly on questions about that instrument.  
**Pass Criteria:** Opening message names the Surbahar; response to step 3 references the Surbahar and its origins without asking for clarification.  
**Fail Criteria:** Opening message is generic; bot asks which instrument the user means; bot answers about a different instrument.

---

## TC-005-03 — Bot Follows the Conversation Across Multiple Exchanges

**Type:** Happy Path  
**Priority:** High  
**Environment:** Desktop

**Preconditions:**
- Chat widget visible on any page
- No prior messages sent in the current session

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Type "What is the Baglama Saz?" and send | Bot gives an overview of the Baglama Saz |
| 2 | Type "What genre uses it most?" and send — do not repeat the instrument name | Bot answers about the Baglama Saz without asking for clarification |
| 3 | Type "How does that compare to the Oud?" and send | Bot compares both instruments by name in a coherent response |

**Expected Result:** Bot carries context from one exchange to the next without the user re-stating the instrument name.  
**Pass Criteria:** All three responses are connected and make sense in sequence. Bot never asks "which instrument are you referring to?"  
**Fail Criteria:** Bot loses context between exchanges, asks for clarification, or gives a response unrelated to the Baglama Saz in steps 2 or 3.

---

## Notes

- Conversation history resets on page refresh — expected behavior
- Suggestion chips on desktop stay visible throughout the session as persistent shortcuts