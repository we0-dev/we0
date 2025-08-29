#!/bin/bash

# Build script for Cloudflare Pages
echo "Building for Cloudflare Pages..."

# Clean previous build
rm -rf dist

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Set environment for web build
export ELECTRON=false

# Build the application
echo "Building application..."
pnpm run build:web

# Copy Cloudflare Pages specific files
echo "Copying Cloudflare Pages configuration..."
cp public/_redirects dist/
cp public/_headers dist/
cp public/icon-*.svg dist/

# Create a simple _worker.js for additional routing if needed
cat > dist/_worker.js << 'EOF'
export default {
  async fetch(request, env, ctx) {
    // Handle SPA routing
    const url = new URL(request.url);
    if (!url.pathname.includes('.') && url.pathname !== '/') {
      return env.ASSETS.fetch(new URL('/index.html', request.url));
    }
    return env.ASSETS.fetch(request);
  }
};
EOF

echo "Build completed successfully!"
echo "Output directory: dist/"