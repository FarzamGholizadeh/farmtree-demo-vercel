# Tests

Two layers:

## 1. Static verifier (no PHP/WordPress needed) — runs now

```bash
node tests/verify.mjs
```

Asserts the non-negotiable invariants directly against the source:

- no hard-coded API key / secret / password in any file;
- `get_api_key()` reads **only** the `FARMTREE_AI_API_KEY` constant/env — never the DB or request;
- the key is never localized to the browser, returned by REST, or logged;
- every PHP file has the `ABSPATH` guard and balanced braces;
- the REST layer never fabricates an AI reply when unconfigured (structured error instead);
- the Overview page only reports "active" via `is_assistant_active()`.

Exit code `0` = pass. Wire this into CI as a fast gate.

## 2. PHPUnit (WordPress test suite) — runs in CI

```bash
# one-time: install the WP test library, then:
WP_TESTS_DIR=/path/to/wordpress-tests-lib phpunit
```

`tests/test-plugin.php` covers provider-config gating, the always-on safe-fallback
rule, disabled seeded skills with the approved URLs, Knowledge CRUD + keyword
retrieval, the SSRF host filter (incl. the cloud metadata address), and that
settings never store an `api_key`.

## 3. Lint (CI)

```bash
find . -name '*.php' -not -path './tests/*' -print0 | xargs -0 -n1 php -l
```
