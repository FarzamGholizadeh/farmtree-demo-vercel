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

## Release checklist

- [ ] `FT_FORM_ENDPOINT` contains a real Formspree form ID
- [ ] Test one submission from each of the three forms on the deployed URL
- [ ] Confirm the notification email arrives
