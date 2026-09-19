# Production route inventory — baseline

Machine-readable evidence: [ROUTE-INVENTORY.json](ROUTE-INVENTORY.json).
This is the pre-remediation production baseline, not a post-release PASS report.

55 actual route variants were fetched sequentially:40 manifest-derived paths,
nine short canonical News URLs and six category archives discovered from the
WordPress sitemap. All final responses were200; dated News URLs retain their
recorded redirects. Five sitemap children contain46 URLs. Reserved locales and
the deliberately nonexistent route return404; legacy Proof Story redirect
chains are recorded separately.

Each inventory entry records observed status, full redirect chain, canonical,
robots directives, title, description, H1/headings, parsed structured data,
Open Graph, image/link counts and exact JSON pointers to full image/link/copy
evidence. Evidence files carry SHA256 hashes. Missing descriptions/canonicals
are null, not assumed PASS. Nav/footer destinations are covered by the fetched
anchor collection;44 distinct same-origin anchor destinations and three domain/
slash canonicalization probes were checked with zero HTTP errors.

Five routes match actual production browser matrix paths exactly:Homepage,
Platform, Solutions, Farm Valuation and Investors. Their recorded widths and
overflow measurements are included, alongside observed console errors. All
other routes explicitly retain UNKNOWN console/responsive status. The browser
report's `/news/` test has no recorded final URL, so it is not silently mapped
to News & Insights or an article. Zero overflow is not a blanket visual-quality
or accessibility PASS.

Current WordPress facts are linked to BASELINE.md: Homepage439 published,
blog_public1 and short post permalinks. Fresh per-route database IDs were not
exported to this reviewer; historical release IDs are not presented as fresh.
No claim of actual search-engine index inclusion is made.

Rebuild this baseline document from its recorded evidence with:

`node scripts/build-route-inventory.cjs`

The generator initializes incoming-anchor counts at numeric zero and rejects
any count that is not a non-negative safe integer before writing the inventory.

After deployment, save a new crawl snapshot and produce a separate post-release
inventory/diff; do not overwrite baseline evidence or promote unknown checks.
