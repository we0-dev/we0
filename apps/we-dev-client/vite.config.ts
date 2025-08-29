import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import path from "path";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import { VitePWA } from 'vite-plugin-pwa';

const isElectron = process.env.npm_lifecycle_event?.startsWith("electron:");

export default defineConfig(async ({ mode }) => {
  const glslPlugin = (await import("vite-plugin-glsl")).default;

  const env = loadEnv(mode, process.cwd(), "");

  process.env = { ...process.env, ...env };

  // Check if building for web (not Electron)
  const isWebBuild = !process.env.ELECTRON;

  return {
    plugins: [
      viteCommonjs(),
      {
        name: "handle-dynamic-imports",
        transform(code, id) {
          if (id.includes("generateJSX.ts")) {
            return {
              code: code.replace(
                /import.*from ['"]\.\/images\/\${imageName}['"];?/g,
                "const image = await import(`./images/${imageName}`);"
              ),
              map: null,
            };
          }
        },
      },

      glslPlugin({
        include: [
          "**/*.glsl",
          "**/*.wgsl",
          "**/*.vert",
          "**/*.frag",
          "**/*.vs",
          "**/*.fs",
        ],
        exclude: undefined,
        warnDuplicatedImports: true,
        defaultExtension: "glsl",
        watch: true,
        root: "/",
      }),

      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'openai-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
              },
            },
            {
              urlPattern: /^https:\/\/openrouter\.ai\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'openrouter-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
              },
            },
          ],
        },
        manifest: {
          name: 'We Dev - AI Code Generator',
          short_name: 'We Dev',
          description: 'AI-powered code generation and development tool',
          theme_color: '#7c3aed',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/icon-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
            },
            {
              src: '/icon-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
            },
            {
              src: '/icon-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
            {
              src: '/icon-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
      // Only include Electron plugins when building for Electron
      ...(isWebBuild ? [] : [
        electron([
          {
            entry: "electron/main.ts",
          },
          {
            entry: "electron/preload.ts",
            onstart(options) {
              options.reload();
            },
          },
        ])
      ]),
    ],

    base: "/", 
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        external: isWebBuild ? [] : ["@electron/remote", "electron"],
        output: {
          manualChunks(id) {
            if (id.includes("workspace/")) {
              return null;
            }
          },
        },
      },
      copyPublicDir: true, 
      assetsDir: "assets",
      // Ensure proper chunking for web builds
      chunkSizeWarningLimit: 1000,
    },

    server: {
      headers: isElectron
        ? {}
        : {
            "Cross-Origin-Embedder-Policy": "credentialless",
            "Cross-Origin-Opener-Policy": "same-origin",
          },
      watch: {
        ignored: ["**/workspace/**"], 
      },
    },

    css: {
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")], 
      },
    },

    define: {
      "process.env": env,
      ...(isWebBuild ? {
        // Mock Node.js globals for web builds
        "process.platform": '"web"',
        "process.execPath": '"/usr/bin/node"',
        "process.env": "{}",
      } : {}),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@sketch-hq/sketch-file-format-ts": "@sketch-hq/sketch-file-format-ts",
        "ag-psd": "ag-psd",
        ...(isWebBuild ? {
          // Node.js polyfills for web builds
          "node:fs": false,
          "node:path": false,
          "node:os": false,
          "child_process": false,
          "events": false,
          "fs": false,
          "path": false,
          "os": false,
        } : { "@electron/remote": "@electron/remote/main" }),
      },
    },

    optimizeDeps: {
      include: [
        "uuid",
        "@sketch-hq/sketch-file-format-ts",
        "ag-psd",
        "@codemirror/state",
        "seedrandom"
      ],
      exclude: isWebBuild ? [] : ["@electron/remote", "electron"],
      esbuildOptions: {
        target: "esnext",
      },
    },

    publicDir: isWebBuild ? "public" : path.resolve(__dirname, "workspace"),
  };
});
