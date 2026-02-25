# Bug Report — BR-004
**Site:** https://www.soundbeyondborders.com  
**Author:** Hunter Eastland  
**Date Filed:** February 2026  
**Status:** Open  

---

## Summary
Intermittent SSL protocol error on the custom domain (`www.soundbeyondborders.com`) preventing page load. Error does not appear to affect the Vercel subdomain (`mymusicbookingwebsite.vercel.app`).

---

## Environment
| Field | Details |
|---|---|
| URL | https://www.soundbeyondborders.com |
| Browser | Chrome |
| OS | Windows |
| Viewport | Desktop |
| Frequency | Intermittent — cannot be consistently reproduced |

---

## Error
```
ERR_SSL_PROTOCOL_ERROR
www.soundbeyondborders.com sent an invalid response.
```

---

## Steps to Reproduce
1. Leave the site idle for an extended period
2. Attempt to navigate to `https://www.soundbeyondborders.com`
3. Observe SSL error page in browser

**Note:** This bug is intermittent and cannot be reliably reproduced on demand. It appears most likely to occur after a period of site inactivity. Reloading the page sometimes resolves the error.

---

## Expected Result
Page loads successfully over HTTPS with a valid SSL connection.

## Actual Result
Browser displays `ERR_SSL_PROTOCOL_ERROR` — "This site can't provide a secure connection. www.soundbeyondborders.com sent an invalid response."

---

## Suspected Cause
Likely related to Vercel serverless cold start behavior. When the site has been idle, Vercel may spin down resources and during the wake-up window SSL negotiation may fail intermittently before the site is fully running. The fact that the error only occurs on the custom domain and not the Vercel subdomain suggests the issue may also involve DNS or SSL certificate configuration specific to the custom domain.

---

## Verification
- Confirmed error does **not** occur on `mymusicbookingwebsite.vercel.app`
- Confirmed error resolves on its own after a short period
- Screenshot captured during occurrence

---

## Verification
- Confirmed error does **not** occur on `mymusicbookingwebsite.vercel.app`
- Confirmed error resolves on its own after a short period
- Screenshot captured during occurrence

## Evidence
- `BR-004-ssl-protocol-error.png` — Chrome ERR_SSL_PROTOCOL_ERROR on www.soundbeyondborders.com

## Priority
**Low** — Site self-recovers and the error is intermittent. No data loss or functional regression observed. Monitor for increased frequency.