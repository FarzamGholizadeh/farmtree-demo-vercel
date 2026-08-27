# FT Bot / FarmTree AI Assistant

A production-safe, manageable AI assistant for the FarmTree WordPress site.
It provides an admin area to curate **Knowledge**, shape **Behavior**, and define
**Skills**, plus a secure, server-side chat endpoint and a refactored front-end
chat widget.

> **Status: ships inactive.** Activating the plugin does nothing visible until an
> administrator configures a provider on the server *and* switches the assistant
> on. There is no fake "AI is active" state.

---

## Security model (read this first)

- **The AI API key is read only from a server constant / environment variable**
  (`FARMTREE_AI_API_KEY`). It is **never** stored in the database, **never** shown
  in the admin UI, **never** sent to the browser, and **never** logged.
- **No fabricated answers.** If no provider is configured, the assistant stays
  off and the REST endpoint returns a structured `unavailable` error — it never
  invents a reply.
- **Grounded answers.** The model may only state facts from the approved
  Knowledge you add. When a question isn't covered, the always-on safe-fallback
  rule makes it ask the visitor to confirm with the FarmTree team.
- **The provider is called server-side only.** The browser receives just the
  public REST URL, a nonce, and the enabled skill labels.

### Configure a provider (wp-config.php)

```php
define('FARMTREE_AI_PROVIDER', 'openai');       // adapter slug
define('FARMTREE_AI_API_KEY',  'sk-…');          // keep OUT of version control
define('FARMTREE_AI_MODEL',    'gpt-4o-mini');   // optional
// Optional: OpenAI-compatible gateway endpoint
// define('FARMTREE_AI_ENDPOINT', 'https://your-gateway/v1/chat/completions');
```

Use `anthropic` as the provider slug for the Anthropic Messages API. The API
key is still read only from `FARMTREE_AI_API_KEY`; it is sent server-side in the
provider-required `x-api-key` header and never exposed to the browser.

Then in **FarmTree AI → Settings**, use **Test connection**, and switch
**Enable on website** on.

---

## Admin area

Top-level menu **FarmTree AI** with five pages:

| Page | Purpose |
|------|---------|
| **Overview** | True status (never "active" without a configured provider), counts, safety notes. |
| **Knowledge** | Add sources by **scanning a public URL** (server-side, SSRF-safe, review-before-save) or by **pasting text**. Enable/disable/delete. |
| **Behavior** | Role, brand voice, guardrails, language handling, answer length, handoff. The safe-fallback rule is shown read-only and always enforced. |
| **Skills** | CRUD + reorder. Ships **five disabled example skills**; the Platform skill uses the login URL and the Demo skill uses the register URL. |
| **Settings** | Provider status (read-only), enable switch, model override, history/output limits, minute/daily rate limits, logging preference, uninstall data policy. |

All admin writes are capability-checked (`manage_options`), nonce-verified and
sanitized.

---

## Front-end chat

- Conversation UI with quick-reply chips built from **enabled** skills.
- Loading, error and **retry** states. No permanent lead form.
- Desktop: a panel pinned inside the viewport. Mobile: a full-screen sheet with
  safe-area insets.
- Launcher is ≥44×44, hidden while the panel or the theme's mobile (Bento) menu
  is open, and layered below that menu.
- Renders only when the assistant is truly active.

### REST endpoint

`POST /wp-json/farmtree-ai/v1/chat`

- Nonce-verified (`X-WP-Nonce` / `X-FT-AI-Nonce`), per-IP + per-session minute
  and daily rate limited.
- Validates and length-caps the message; trims history to the configured window.
- Retrieves approved context via lightweight **keyword** scoring (not vector
  search), caps it, and calls the provider server-side.
- Returns only `{ ok, reply, sources }` or a structured `{ ok:false, code,
  message }`. No secret, key, prompt or PII is ever returned or logged. Logged
  conversations (opt-in) store a one-way hashed IP only.

---

## Data

Custom tables via `dbDelta`, versioned by `ft_ai_db_version`:
`wp_ft_ai_knowledge`, `wp_ft_ai_skills`, `wp_ft_ai_conversations`,
`wp_ft_ai_messages`. Non-secret settings live in the `ft_ai_settings` and
`ft_ai_behavior` options.

**Uninstall** keeps all data by default. It is removed only if you enabled
"Delete all plugin data when the plugin is uninstalled" in Settings.

---

## Tests

See [`tests/README.md`](tests/README.md). `node tests/verify.mjs` runs the static
security/structure gate with no PHP/WordPress needed; PHPUnit covers the runtime
behavior in CI.
