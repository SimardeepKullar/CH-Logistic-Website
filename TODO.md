# CH Logistics — Project TODO

## 🔴 Pending (requires domain `chlogistic.ca`)

### Email — `api/quote.js`
- [ ] Swap `from` address
  ```js
  // Change FROM:
  from: 'CH Logistics Quote Form <onboarding@resend.dev>',
  // Change TO:
  from: 'CH Logistics Quote Form <quotes@chlogistic.ca>',
  ```
- [ ] Swap `to` address
  ```js
  // Change FROM:
  to: ['simardeepk7@gmail.com'],
  // Change TO:
  to: ['dispatch@chlogistic.ca'],
  ```
- [ ] Verify `chlogistic.ca` domain in Resend dashboard (add DNS TXT/MX records)
- [ ] Update contact email display in `index.html` (currently obfuscated by Cloudflare)

---

## 🟡 In Progress

### Careers / Job Application Page — `careers.html` + `api/apply.js`
- [x] Built `careers.html` — perks section, open positions cards, application form
- [x] Built `api/apply.js` — serverless function with resume + abstract as email attachments
- [x] Position cards click-to-select pre-fill the dropdown and scroll to form
- [ ] Add Careers link to nav in `index.html` (currently only in footer)
- [ ] Swap `from` / `to` in `api/apply.js` once domain is verified (same as quote.js)

---

## 🟢 Completed

### Infrastructure
- [x] Site hosted on Vercel, connected to GitHub (auto-deploys on push)
- [x] Separated into `index.html` + `styles.css` + `images/` folder structure

### Quote Form
- [x] Built `api/quote.js` — Vercel serverless function
- [x] Integrated Resend API for email delivery
- [x] `RESEND_API_KEY` added as Vercel environment variable
- [x] Form validation (required fields, email format)
- [x] Loading / success / error states on submit button
- [x] Branded HTML email template (navy header, route table, details block)
- [x] Fixed `export default` → `module.exports` for Vercel CommonJS compatibility
- [x] Fixed broken `</script>` tag in `index.html`
- [x] Fixed route box layout — replaced `display:flex` with inline table for Gmail compatibility

### Design
- [x] Logo + brand colours (navy #1a2b6d, cyan #00a8d8) applied throughout
- [x] Real fleet photos embedded (hero, fleet banner, about, trailers banner)
- [x] Slogan "Moving You Forward…" added from trailer branding
- [x] Phone number updated to real number: +1 (905) 796-1062
- [x] Scroll-triggered fade-up animations
- [x] Responsive layout (mobile / tablet / desktop)