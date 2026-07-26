# Wedding website

A lightweight, responsive wedding website built with plain HTML, CSS, and JavaScript. It is
dependency-free and ready to host with GitHub Pages.

## Preview locally

Open `index.html` directly in a browser, or start a local server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the main branch and the `/ (root)` folder, then save.

## Customize

All event details and copy are in `index.html`. Colors and typography are defined near the top of
`styles.css` as CSS custom properties.

### Password gate

The password is `doorcountymonty`. Access is remembered for the current browser session.

To change it, generate a SHA-256 hash for the new password and replace the `PASSWORD_HASH` value at
the top of `script.js`. In PowerShell:

```powershell
$value = "your-new-password"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($value)
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
($hash | ForEach-Object { $_.ToString("x2") }) -join ""
```

This is a client-side convenience gate, not secure access control. GitHub Pages serves the site's
source files publicly, so a determined visitor can bypass it.
