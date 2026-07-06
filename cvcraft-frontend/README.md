# CVCraft Pro — Frontend

Static HTML/CSS/JS. No build step — open `index.html` via any static server
(or Live Server / `npx serve`). Talks to the `cvcraft-backend` API for auth,
saved CVs, and payment records instead of `localStorage`.

## Setup

1. Run the backend (see `cvcraft-backend/README.md`) or point at a deployed one.
2. In `index.html`, set:
   ```html
   <script>window.CVCRAFT_API_BASE_URL = 'http://localhost:4000/api';</script>
   ```
   to wherever the backend is running.
3. Serve the folder, e.g.:
   ```bash
   npx serve .
   # or
   python3 -m http.server 5500
   ```

## File layout

```
index.html          markup for nav, auth modal, dashboard, CV builder, profile, settings
css/styles.css       all styling (templates, dark mode, modal, dashboard, chatbot)
js/api.js            fetch wrapper + JWT storage, one function per backend endpoint
js/notifications.js  toast messages
js/theme.js          dark mode toggle
js/templates.js      the 9 CV template layouts + content-overflow line limits
js/auth.js           login/signup/logout/forgot-password, wired to js/api.js
js/cvBuilder.js       form state, live preview, photo upload, payment flow, PDF export
js/dashboard.js       CV/payment history, profile stats, settings page
js/chatbot.js        canned-response assistant widget
js/main.js           page navigation + bootstrap
```

## What changed vs. the original single-file version

- **Auth** now hits `/api/auth/*` with a real hashed password + JWT, instead of
  storing plaintext passwords in `localStorage`.
- **CVs** are saved to the backend (`/api/cvs`) so a "CV history" is real data,
  not something regenerated from whatever's in the browser's `localStorage`.
- **Payments**: a `pending` row is created before the PayPal redirect and
  confirmed after — same simplified "did you pay? [OK/Cancel]" UX as before
  for now (see the note in `cvBuilder.js` / the backend's
  `payment.controller.js`), but backed by a real table instead of nothing.
- Marketing copy on the Features page was trimmed for brevity — expand it
  back out if you want the full 9-template breakdown from the original.

## Known gaps to close before shipping for money

- Wire a real PayPal webhook (server-to-server signature verification) instead
  of trusting the client's "I paid" click.
- Add `PUT /api/auth/me`, `PUT /api/auth/password`, and `DELETE /api/auth/me`
  endpoints on the backend — the Profile/Settings pages call out where they'd
  plug in (`saveProfile`, `changePasswordFromSettings`, `deleteAccount` in
  `js/dashboard.js`).
- Add a real email provider for the forgot-password flow.
