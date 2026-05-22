# Cloudflare Pages Deployment Guide

This guide explains how to deploy the We Dev application to Cloudflare Pages.

## Prerequisites

- Node.js 18+ and pnpm installed
- Cloudflare account with Pages enabled
- Git repository connected to Cloudflare Pages

## Quick Deployment

### 1. Build the Application

```bash
# From the root directory
pnpm run build:pages
```

This command will:
- Build the React application using Vite
- Copy Cloudflare Pages configuration files
- Generate the `dist/` directory ready for deployment

### 2. Deploy to Cloudflare Pages

#### Option A: Using Wrangler CLI

```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy apps/we-dev-client/dist --project-name=we-dev-pages
```

#### Option B: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Pages
3. Create a new project or connect to existing Git repository
4. Set build settings:
   - **Build command**: `pnpm run build:pages`
   - **Build output directory**: `apps/we-dev-client/dist`
   - **Root directory**: `/` (root of repository)

## Configuration Files

### `wrangler.toml`
```toml
name = "we-dev-pages"
pages_build_output_dir = "apps/we-dev-client/dist"
```

**Note:** Cloudflare Pages doesn't support the `[build]` section in `wrangler.toml`. Build commands should be configured in the Cloudflare Dashboard or GitHub Actions.

### `_redirects`
Handles SPA routing by redirecting all routes to `index.html`:
```
/*    /index.html   200
```

### `_headers`
Sets security headers for the application:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### `_routes.json`
Provides advanced routing configuration for Cloudflare Pages:
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/assets/*",
    "/manifest.webmanifest",
    "/sw.js",
    "/workbox-*.js",
    "/icon-*.svg"
  ],
  "routes": [
    {
      "src": "/*",
      "dest": "/index.html"
    }
  ]
}
```

### `_worker.js`
Custom worker script for additional routing logic and SPA support.

## Build Process

The build process includes:

1. **Vite Build**: Compiles React application with optimizations for web deployment
2. **PWA Generation**: Creates service worker and manifest files
3. **Configuration Copy**: Copies all Cloudflare Pages configuration files
4. **Worker Generation**: Creates `_worker.js` for advanced routing logic
5. **Web Compatibility**: Ensures no Node.js/Electron dependencies in web build

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all dependencies are installed with `pnpm install`
2. **Routing Issues**: Verify `_redirects` file is properly copied to `dist/`
3. **Asset Loading**: Check that `base` in Vite config is set to `/`

### Build Commands

```bash
# Clean build
rm -rf apps/we-dev-client/dist
pnpm run build:pages

# Development build
cd apps/we-dev-client && pnpm dev

# Production build only
cd apps/we-dev-client && pnpm build:web
```

## Environment Variables

If you need to set environment variables for Cloudflare Pages:

1. Go to your Pages project settings
2. Navigate to Environment variables
3. Add any required variables (e.g., API keys)

## Web Compatibility

The application has been modified for web deployment:

- **Conditional Imports**: Uses web-compatible components when building for web
- **Node.js Polyfills**: Replaces Node.js specific code with web-compatible alternatives
- **Electron Removal**: Excludes Electron-specific code from web builds
- **Mock Implementations**: Provides mock implementations for desktop-only features

## Performance Optimization

The build includes:
- Code splitting and lazy loading
- PWA capabilities with service worker
- Optimized assets with compression
- Security headers for better protection

## Support

For issues with Cloudflare Pages deployment, check:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- Build logs in Cloudflare Dashboard