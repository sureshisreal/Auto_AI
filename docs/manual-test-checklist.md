# QA Automation Framework — Manual Testing Checklist

## Target Applications
1. **Local Demo App**: http://127.0.0.1:3000
2. **WeSendCV**: https://wesendcv.com

---

## Section 1: Local Demo App Test Checklist (~10 minutes)
### 1.1 Page Load & Basic Navigation
- [ ] Open http://127.0.0.1:3000 in Chrome, Firefox, Safari
- [ ] Verify page loads completely
- [ ] Verify animated box and "Animate Box" button are visible
- [ ] Verify "Go to About" button is visible

### 1.2 Interactions
- [ ] Click "Animate Box" and verify the animation occurs
- [ ] Click "Go to About" and verify navigation (should show 404 for now, which is expected)

### 1.3 Accessibility
- [ ] Navigate with keyboard only (Tab, Enter)
- [ ] Verify all elements have proper focus indicators
- [ ] Run axe check (via automated test or axe DevTools)

### 1.4 Performance
- [ ] Page load time <2 seconds
- [ ] No layout shift after load

---

## Section 2: WeSendCV Homepage Checklist (~25 minutes)
### 2.1 Page Load & Navigation
- [ ] Open https://wesendcv.com in Chrome, Firefox, Safari
- [ ] Verify page loads in <3 seconds
- [ ] Verify navigation menu present: Home, About, Jobs, Blog, Contact
- [ ] Verify logo links back to homepage
- [ ] Verify hamburger menu works on mobile (375px)

### 2.2 Hero Section
- [ ] Hero image is visible and loads correctly
- [ ] Tagline text is visible
- [ ] CTA button is present and clickable
- [ ] Hover effect works on CTA button
- [ ] CTA button color matches brand guidelines

### 2.3 Form & Search
- [ ] Search form is visible
- [ ] Search input accepts text
- [ ] Enter key submits search (if applicable)
- [ ] Edge cases: empty search, special characters, long text

### 2.4 Visual & Layout
- [ ] No broken images
- [ ] Colors match brand guidelines
- [ ] Text has sufficient contrast (WCAG AA)
- [ ] No unexpected layout shifts
- [ ] Responsive: mobile (375px), tablet (768px), desktop (1920px)
- [ ] Touch targets ≥44px on mobile

### 2.5 Error & Resilience
- [ ] Disconnect internet and refresh: verify fallback UI
- [ ] Block CSS in DevTools: verify page is still usable
- [ ] Clear cookies and refresh: verify page functions normally

---

## Section 3: Cross-Browser & Cross-Device
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, macOS/iOS)
- [ ] Mobile: iPhone 12 (Safari)
- [ ] Mobile: Pixel 5 (Chrome)

---

## Pass Criteria
All checks marked ✅

---

## Run Automated Tests After Manual
```bash
npm run test:smoke
npm run test:api
```
