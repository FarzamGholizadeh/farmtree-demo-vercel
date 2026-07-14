# FarmTree — Form Submission Setup

All three lead-capture forms submit to a single Formspree endpoint:

| Form | id | Payload `form` field |
|---|---|---|
| Contact / request page | `ftRequestPageForm` | `request-page` |
| "Talk to the team" modal | `ftModalForm` | `contact-modal` |
| Chat widget lead form | `ftChatLeadForm` | `chat-widget` |

## One-time setup (required before go-live)

1. Create a free form at <https://formspree.io> (Forms → New form).
   Set the notification email to the FarmTree inbox.
2. Copy the form ID (the part after `/f/` in the endpoint URL).
3. In `index.html`, find the script block `ft-form-endpoint-v1` and replace
   `YOUR_FORM_ID` in `window.FT_FORM_ENDPOINT` — **one place only**.

```js
window.FT_FORM_ENDPOINT = 'https://formspree.io/f/XXXXXXXX';
```

## Behavior

- Success → each form shows its existing success state.
- Failure (network error, unconfigured endpoint, Formspree error) → the
  form shows an inline error message and the submit button re-enables.
  **There is no fake success path.** While `YOUR_FORM_ID` is unconfigured,
  every submission deliberately shows the error state.
- Submit buttons are disabled during the request to prevent double-sends.

## ⛔ RELEASE BLOCKER

`FT_FORM_ENDPOINT` still contains the `YOUR_FORM_ID` placeholder.
Until a real Formspree form ID is set, every submission intentionally
shows the error state — **there is no simulated success path.**
The site must not go live in this state.

## Spam protection

All three forms carry a visually-hidden `_gotcha` honeypot field
(`tabindex="-1"`, `aria-hidden="true"` — invisible to users, keyboard and
screen readers). Formspree silently discards any submission where it is
filled. Formspree also applies its own server-side spam filtering.

## Final verification checklist (run once the form ID is provided)

Per release requirements — all three forms tested **separately**
(request page, contact modal, chat widget):

- [ ] Successful real submission from each form
- [ ] Confirmed delivery to the recipient inbox for each form
- [ ] Error state verified (e.g. temporarily break the endpoint / offline)
- [ ] Submit button disabled during the request (no double-send)
- [ ] Honeypot: filled `_gotcha` submission is NOT delivered
- [ ] Privacy consent: **pending decision** — a visible consent checkbox is
      new UI content and needs approved wording before it can be added.
      Until then, ensure the privacy policy is linked near each form.
- [ ] No personal data in console logs (verified: the codebase contains
      zero `console.*` calls) or analytics (no analytics scripts present)
