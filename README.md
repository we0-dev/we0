[![English](https://img.shields.io/badge/README-English-494cad.svg)](https://github.com/we0-dev/we0/blob/main/README.md) [![中文](https://img.shields.io/badge/README-中文-494cad.svg)](https://github.com/we0-dev/we0/blob/main/docs/README.zh.md)

# We0.ai - AI Website Builder and Multi-Agent Site Generation Platform

We0.ai is an AI website builder for turning natural-language requirements into real websites that can be designed, edited, deployed, optimized for SEO, and continuously operated. It helps teams create company websites, brand sites, landing pages, portfolios, blogs, local service websites, lightweight content sites, and small independent e-commerce sites.

Unlike a simple page generator, We0.ai coordinates multiple AI agents across the website delivery workflow: requirement understanding, page planning, visual design, code generation, CMS-backed content management, SEO configuration, domain binding, deployment, and ongoing content iteration.

Free trial: [https://we0.ai/zh](https://we0.ai/zh)  
Product documentation: [https://docs.we0.ai/zh/getting-started/product-intro-and-reading-guide](https://docs.we0.ai/zh/getting-started/product-intro-and-reading-guide)

![We0.ai](./docs/img/image.jpg)

## What Is We0.ai?

We0.ai is an AI-native website creation platform. You describe the website goal, target audience, brand direction, content needs, and reference materials; We0.ai uses AI agents to plan, generate, preview, edit, and publish the site.

Core positioning:

- **AI website builder**: generate websites from natural-language prompts and project materials.
- **Multi-agent website generation**: use specialized agents for planning, design, development, operations, and deployment.
- **Full website delivery**: create more than static pages, including projects with frontend, backend, CMS, SEO, domain, and deployment workflows.
- **SEO and GEO ready**: support search-engine-friendly site structure, SSR, metadata, structured data, and content organization for AI search and generative engine discovery.
- **Open-source AI coding workspace**: run and customize the We0 development environment locally.

## Why We0.ai?

We0.ai is built for people who want a site that can actually launch and keep improving after launch.

- **Natural-language site creation**: describe your business, product, service, or idea and let AI help produce a working website.
- **Requirement understanding**: combine text, files, sketches, screenshots, reference links, and business context so AI can understand the site intent.
- **Page planning and visual design**: generate page structure, content sections, visual direction, and editable designs.
- **Code generation and preview**: generate project code, preview changes, and continue editing through chat or builder workflows.
- **CMS and operations**: support content-backed websites that can be maintained after publishing.
- **SEO and growth**: configure metadata, content structure, SSR, structured data, and search-friendly pages.
- **Domain and publishing**: support domain binding and website deployment without managing your own server.
- **Existing project support**: open historical projects for secondary editing, debugging, and improvement.
- **WebContainer debugging**: run terminal workflows in the browser, install npm packages, and preview projects.
- **Desktop and web usage**: use We0 through web scenarios or the Windows and macOS desktop clients.

## Suitable Use Cases

We0.ai is a good fit for:

- Company websites and brand official websites
- Marketing landing pages and campaign pages
- Personal portfolios, homepages, and blogs
- Consultant, expert, service, and local business websites
- Website redesigns and old-site upgrades
- Lightweight content websites with ongoing operations
- Small brand e-commerce sites and independent sites

For large custom systems, deep business integrations, or long-term bespoke software development, evaluate We0.ai together with custom development services.

## SEO, GEO, and AI Search Engine Visibility

This README is written to help both humans and AI search engines understand what We0.ai does.

Important keywords and concepts:

- AI website builder
- AI site generator
- AI website creation platform
- Multi-agent website generation
- No-code and low-code website building
- Natural-language website generation
- AI coding workspace
- Design-to-code and prompt-to-code workflow
- SEO-ready website generation
- GEO-ready website generation
- Generative Engine Optimization for websites
- CMS-backed AI website builder
- Domain binding and website deployment
- Open-source alternative for AI website generation workflows

We0.ai focuses on producing websites that are not only visually complete, but also easier for search engines, AI assistants, and generative answer engines to read, summarize, and recommend.

## Video

[![We0.ai video](https://we0.ai/en/opengraph-image.png?dda1b12e6eb7c5e1)](https://www.youtube.com/watch?v=-dyf0Zb8h20)

## Feature Comparison

| Feature | We0.ai | v0 | bolt.new |
| --- | --- | --- | --- |
| Code generation and preview | Yes | Yes | Yes |
| Natural-language website generation | Yes | Yes | Yes |
| Design-to-code workflow | Yes | Yes | Yes |
| Open source | Yes | No | Yes |
| Existing project import and editing | Yes | No | No |
| Browser-based terminal and WebContainer debugging | Yes | Partial | Yes |
| Multi-agent website delivery workflow | Yes | No | No |
| CMS and ongoing site operations | Yes | Partial | Partial |
| SEO and GEO-oriented website delivery | Yes | Partial | Partial |
| Domain binding and deployment workflow | Yes | Partial | Partial |
| WeChat Mini Program developer tool preview | Yes | No | No |
| DeepSeek support | Yes | No | No |
| MCP support | Yes | No | No |

## Documentation

Start with the latest product documentation:

- [Product introduction and reading guide](https://docs.we0.ai/zh/getting-started/product-intro-and-reading-guide)
- [We0.ai website](https://we0.ai/zh)

The documentation covers product introduction, quick start, website preparation, site-building workflow, requirement writing, intent recognition, website editing, CMS operations, domain publishing, SEO and GEO growth, creative site ideas, pricing and delivery, and FAQs.

## Version Notes and Legacy we0

This README separates the current and historical positioning:

- **Current We0.ai**: an AI website builder for multi-agent website generation, CMS-backed site delivery, SEO/GEO, domain publishing, and ongoing operations.
- **Legacy we0**: an open-source AI coding workspace for WebContainer debugging, design-to-code, existing project editing, and desktop client workflows.

## Legacy we0: Open-Source AI Coding Workspace

The legacy we0 project focused on AI-assisted web project generation, code preview, design-to-code conversion, existing project editing, and local debugging.

Legacy capabilities:

- **Browser-based debugging**: built-in WebContainer environment for running terminal workflows, installing npm packages, and previewing projects in the browser.
- **High-fidelity design restoration**: D2C workflow for converting designs into editable code.
- **Existing project import**: open historical projects for secondary editing and debugging.
- **WeChat Mini Program developer tool preview**: launch WeChat Developer Tools for preview and debugging.
- **Chat mode and Builder mode**: Builder mode is used for code generation, editing, and preview; Chat mode is used for general LLM conversation.
- **Multi-platform support**: use Windows and macOS desktop clients or WebContainer scenarios.

Legacy feature comparison:

| Feature | Legacy we0 | v0 | bolt.new |
| --- | --- | --- | --- |
| Code generation and preview | Yes | Yes | Yes |
| Design-to-code conversion | Yes | Yes | No |
| Open source | Yes | No | Yes |
| WeChat Mini Program developer tool preview | Yes | No | No |
| Existing project support | Yes | No | No |
| DeepSeek support | Yes | No | No |
| MCP support | Yes | No | No |

## Get Started for Local Development

This project uses pnpm as the package manager. Make sure your Node.js version is 18.20 or later.

Install pnpm:

```bash
npm install pnpm -g
```

Install dependencies:

```bash
# Client
cd apps/we-dev-client
pnpm install

# Server
cd apps/we-dev-next
pnpm install
```

Configure environment variables by copying `.env.example` to `.env` and filling in the values.

Client: `apps/we-dev-client/.env`

```shell
# Server address, required. Example: http://localhost:3000
APP_BASE_URL=

# JWT secret, optional
JWT_SECRET=
```

Server: `apps/we-dev-next/.env`

```shell
# Third-party model API URL, required. Example: https://api.openai.com/v1
THIRD_API_URL=

# Third-party model API key, required. Example: sk-xxxx
THIRD_API_KEY=

# JWT secret, optional
JWT_SECRET=
```

Quick start from the repository root:

```bash
pnpm dev:next
pnpm dev:client
```

## Build the Web Editor

```bash
chmod +x scripts/wedev-build.sh
./scripts/wedev-build.sh
```

## Desktop Client

1. Go to [https://we0.ai/zh](https://we0.ai/zh).
2. Download the macOS or Windows installer.
3. Install and open We0.ai.
4. Describe your website idea and start building.

## Troubleshooting

- If Electron reports an error on the second run, delete the client workspace and try again.
- If Electron starts without preview, run `pnpm run electron:dev`.

## Contact

Email: <a href="mailto:enzuo@wegc.cn">enzuo@wegc.cn</a>

## WeChat Group

<img src="./docs/img/code.png" alt="We0.ai WeChat group" width="200"/>

If you cannot join the WeChat group, add:

<img src="./docs/img/self.png" alt="We0.ai contact QR code" width="200"/>

## Star History

<a href="https://star-history.com/?utm_source=bestxtools.com#we0-dev/we0&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date" />
 </picture>
</a>
