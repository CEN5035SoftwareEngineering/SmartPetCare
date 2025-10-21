# Copilot instructions for SmartPetCare

This file gives concise, repository-specific guidance so an AI coding assistant can be productive quickly.

Scope
- This is a small static multi-page web project (plain HTML/CSS/JS). There is no build system. Edits should respect existing file layout under top-level folders: `User_login_signup/`, `User_profiles_posting/`, `Messaging_platform/`, `Rebooking/`, `Searching/`, `Feedback/`, plus `index.html` and `styles/`.

Key patterns & conventions
- Navigation is implemented via plain links between pages (e.g. `index.html` -> `User_login_signup/login.html`, `../User_profiles_posting/profile.html`). Keep relative paths consistent when moving files.
- Global styles live in `styles/styles.css`. Prefer small, targeted CSS edits rather than sweeping rewrites. The project uses CSS variables (see :root) for colors; reuse them for consistent theme.
- Authentication uses Parse (Back4App) directly in the browser. See `User_login_signup/login.html` and `signup.html` for Parse initialization and usage:
  - Parse.initialize(...) and Parse.serverURL are present in those pages. Avoid changing app keys unless instructed. When adding new auth behavior, use the same client-side Parse SDK pattern.
- JavaScript is inlined inside HTML files. When creating new pages, you may either inline small scripts or add a new script file in place and link it; prefer adding files under the same folder as the feature page.

Files of interest (examples)
- `User_login_signup/login.html` — Parse.User.logIn example, redirects to `../User_profiles_posting/profile.html` on success.
- `User_login_signup/signup.html` — Parse signUp flow and Parse.User.logOut() use.
- `styles/styles.css` — color variables, responsive navbar rules, `.navbar`, `.btn` classes used across pages.
- `index.html` — landing page and simple toggleMenu() function used for responsive nav.

Behavioral guidance for code edits
- Preserve relative linking and existing class names (e.g. `.navbar`, `.navbar-links`, `.btn.teal`, `.btn.olive`). Many pages rely on these exact names for layout and hover styling.
- When updating markup, keep accessibility in mind (add alt text for images, use label elements for form inputs). Do not change the visible copy unnecessarily.
- For any change that touches authentication or Parse initialization: explicitly state potential security impact, keep keys unchanged, and ask before switching to environment variables or server-side storage.

Testing and dev workflow
- There is no build step; open the files directly in a browser (double-click `index.html` or serve the folder with a static server). Example developer commands (local):
  - Serve with Python 3: `python3 -m http.server` from the project root, then open http://localhost:8000
  - Or use `live-server` / any static file server if preferred.
- Verify navigation between pages and Parse signup/login flows manually in the browser. Look for console errors and check network requests to `https://parseapi.back4app.com/`.

Edge cases & constraints
- This project is intentionally static; avoid introducing frameworks (React, Vue, build toolchains) unless explicitly requested.
- Backend integration is limited to the Parse SDK calls present; assume no server-side code exists in this repo.

When to ask for clarification
- If a change requires new secrets, server-side code, or a build tool: ask the maintainer.
- If you need to remove or rotate Parse keys: ask — this repo currently relies on the existing keys in the client files.

If you modify or add files
- Keep changes minimal and local to a feature folder. When renaming/moving files, update all relative links that reference them.
- Add small, descriptive comments to inline JS where you implement behaviors (e.g. "// Parse login handler").

Contact and next steps
- If unsure about intended behavior for a page, open the corresponding HTML under the feature folder (see list above) and use the existing patterns.

End of instructions.
