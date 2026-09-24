# PeakShield Roofing - Web Application

A premium, modern commercial and residential roofing company platform built with React, TypeScript, Tailwind CSS, and Firebase.

## Deploying to GitHub Pages (Fixing Blank Screen)

This project is configured with relative paths (`./`) and `HashRouter` specifically for GitHub Pages compatibility (e.g. `https://ghafrishamsaal-lab.github.io/Roffing-company-/`).

You have two easy ways to deploy:

### Option 1: Deploy from `/docs` (Instant, No build setup required)
The repository includes a pre-built, production-ready `/docs` directory:
1. Push this repository to your GitHub account (`ghafrishamsaal-lab/Roffing-company-`).
2. In your GitHub repository, navigate to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main`
   - **Folder**: Select `/docs` (instead of `/ (root)`)
4. Click **Save**. Within 1–2 minutes, your website will be live at `https://ghafrishamsaal-lab.github.io/Roffing-company-/`.

### Option 2: Deploy with GitHub Actions (Automated CI/CD)
The repository includes `.github/workflows/deploy.yml`:
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment**:
   - **Source**: Select `GitHub Actions`
3. Every time you push code to `main`, GitHub will automatically build and deploy the application.

---

## Local Development & Building

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (updates both /dist and /docs)
npm run build
```
