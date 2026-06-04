# FarmTree Website — GitHub Pages Deployment Checklist
**File:** `index.html` (single-file SPA, 625 KB)
**Repository:** `farzamgholizadeh/farmtree-preview-3`
**Live URL:** https://farzamgholizadeh.github.io/farmtree-preview-3/

---

## Pre-upload checklist

### Content
- [ ] Open `index.html` locally in a browser and scroll through the homepage
- [ ] Confirm no visible placeholder text remains (none expected)
- [ ] Confirm no "Final visual to be supplied" or "Content to be confirmed" text
- [ ] Confirm hero carousel cycles through 4 slides (8 sec each)
- [ ] Confirm all 4 case study pages open and display full content

### Navigation
- [ ] Click every header nav item — confirm no blank pages
- [ ] Click footer links — confirm correct pages open
- [ ] Test mobile menu (hamburger) — confirm all links work
- [ ] Test "Blog" link — confirm blog page renders
- [ ] Test "Request a demo" modal — confirm it opens and closes

### Forms
- [ ] Open Request page (`data-page="request"`)
- [ ] Submit empty form — confirm validation errors appear
- [ ] Fill in Name, Email, Company — confirm submit works
- [ ] Confirm success state shows: "Thank you. The FarmTree team will review..."
- [ ] Test request modal (CTA buttons across site) — confirm same behaviour

### Language
- [ ] Switch to Dutch — confirm nav, footer, forms, FAQ update
- [ ] Switch to German — confirm same
- [ ] Refresh page with Dutch selected — confirm Dutch persists
- [ ] Check case study page in Dutch — confirm headings/labels translate

### Responsive
- [ ] Test at 375px (iPhone SE) — confirm no overflow
- [ ] Test at 430px (iPhone 14) — confirm hero readable, dots visible
- [ ] Test at 768px (iPad portrait) — confirm grids collapse correctly
- [ ] Test platform dashboard mockup on desktop — confirm visible

### Console
- [ ] Open browser DevTools → Console
- [ ] Confirm no red errors on page load
- [ ] Confirm no 404 requests for broken images
- [ ] Switch language and navigate — confirm no errors

---

## Upload steps

### Option A — Replace via GitHub web UI (simplest)
1. Go to https://github.com/farzamgholizadeh/farmtree-preview-3
2. Click `index.html` in the file list
3. Click the pencil (Edit) icon
4. Select all text → delete → paste contents of new `index.html`
5. Scroll down → Commit changes → "Deploy Phase 7 final polish"
6. Wait ~60 seconds → visit live URL to confirm

### Option B — Via git push
```bash
# Clone or navigate to the repo
cd ~/path/to/farmtree-preview-3

# Copy the updated file
cp ~/Downloads/farmtree_v24_full_feedback_v3_implementation/index.html ./index.html

# Commit and push
git add index.html
git commit -m "Phase 7: final polish, language completion, SaaS credibility"
git push origin main
```

### Option C — Upload assets folder too
If any new images were added (check `assets/` folder for new files):
```bash
cp -r ~/Downloads/farmtree_v24_full_feedback_v3_implementation/assets/* ./assets/
git add assets/
git commit -m "Update assets"
git push origin main
```

---

## Post-upload check
1. Visit https://farzamgholizadeh.github.io/farmtree-preview-3/
2. Hard-refresh (Cmd+Shift+R / Ctrl+Shift+R) to bypass cache
3. Run through the checklist above on the live URL
4. Test on mobile device (not just browser resize)

---

## What changed across Phases 1–7
| Phase | Summary |
|---|---|
| 1+2 | Responsive fixes, Manrope typography, language system v1 |
| 3 | 4 case study pages fully built |
| 4 | 3 audience pages (investors, DFI, NGOs) fully built |
| 5 | Solutions, Track Record, Pricing pages rebuilt |
| 6 | SaaS credibility: platform mockup, numbers strip, data flow |
| 7 | Final polish: dev notes removed, shadows fixed, deploy guards |
