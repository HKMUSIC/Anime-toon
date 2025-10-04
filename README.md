# Anime-toon

### Deploy Frontend on Vercel

You can deploy this React frontend directly to Vercel using the button below:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/Hkmusic/Anime-toon>)

**Important:** Replace `<YOUR-GITHUB-USERNAME>` and `<YOUR-REPO-NAME>` with your actual GitHub username and repo name.

#### Fixing Peer Dependency Conflicts

Since `react-hls-player` has a peer dependency on React 16, Vercel build may fail. To fix it:

1. Add a **Vercel-specific build script** in `package.json`:

```json
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test",
  "eject": "react-scripts eject",
  "vercel-build": "npm install --legacy-peer-deps && npm run build"
}
