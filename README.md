[![English](https://img.shields.io/badge/README-English-494cad.svg)](https://github.com/we0-dev/we0/blob/main/README.md) [![中文](https://img.shields.io/badge/README-中文-494cad.svg)](https://github.com/we0-dev/we0/blob/main/docs/README.zh.md) 

# we0

## What is We0

![alt text](./docs/img/image-1.png)

## Video
[![youtube](https://we0.ai/en/opengraph-image.png?dda1b12e6eb7c5e1)](https://www.youtube.com/watch?v=-dyf0Zb8h20)

## What Makes We0 Different?

Currently, Cursor, v0, and Bolt.new have impressive performance in web project generation. The We0 project has the following features:

Supports browser-based debugging: Built-in WebContainer environment allows you to run a terminal in the browser, install and run npm and tool libraries.

High-fidelity design restoration: Utilizes cutting-edge D2C technology to achieve 90% design restoration.

Supports importing historical projects: Unlike Bolt.new, which runs in a browser environment, We0 can directly open existing historical projects for secondary editing and debugging.

Integrates with WeChat Mini Program Developer Tools: Allows direct preview and debugging by clicking to launch the WeChat Developer Tools.

Multi-platform support: Supports Windows and Mac operating systems for client downloads, as well as web container scenarios, allowing you to choose the appropriate terminal based on usage scenarios.

| Feature                                    | we0 | v0  | bolt.new |
| ------------------------------------------ | --- | --- | -------- |
| Code generation and preview                | ✅  | ✅  | ✅       |
| Design-to-code conversion(no open)         | ✅  | ✅  | ✅       |
| Open-source                                | ✅  | ❌  | ✅       |
| Supports WeChat Mini Program Tools preview | ✅  | ❌  | ❌       |
| Supports existing projects                 | ✅  | ❌  | ❌       |
| Supports Deepseek                          | ✅  | ❌  | ❌       |
| Supports MCP                               | ✅  | ❌  | ❌       |
| Supports Generate Design(no open)          | ✅  | ❌  | ❌       |

## Get Started

This project uses pnpm as the package management tool. Ensure your Node.js version is 18.20 .

- Install pnpm

```bash
npm install pnpm -g
```

- Install dependencies

```bash
# Client
cd apps/we-dev-client
pnpm install

# Server
cd apps/we-dev/we-dev-next
pnpm install

```

- Configure environment variables

Rename .env.example to .env and fill in the corresponding content.

Client apps/we-dev-client/.env
```shell
# SERVER_ADDRESS [MUST*] (eg: http://localhost:3000)
APP_BASE_URL=

# JWT_SECRET [Optional]
JWT_SECRET=
```

Servers apps/we-dev-next/.env
```shell
# Third-Party Model URL [MUST*] (eg: https://api.openai.com/v1)
THIRD_API_URL=

# Third-Party Model API-Key [MUST*] (eg:sk-xxxx)
THIRD_API_KEY=

# JWT_SECRET [Optional]
JWT_SECRET=

```

## Build the Web Editor

```bash
chmod +x scripts/wedev-build.sh

./scripts/wedev-build.sh
```

**Quick Start Method**
Supports quick start from the root directory.

```bash
"dev:next": "cd apps/we-dev-next && pnpm install && pnpm dev",
"dev:client": "cd apps/we-dev-client  && pnpm dev",
```


## How to Install and Use
  1. Go to https://old.we0.ai/.
  2. Select Download for Mac or Windows to download the installer.
  3. Run the installer.
  4. Open the We0 application.
## Question
- If electron reports an error during the second run, please delete the client workspace
- electron If there is no preview when starting, run pnpm run electron:dev

## Contact US

send email to <a href="mailto:enzuo@wegc.cn">enzuo@wegc.cn</a>

## WeChat Group Chat
<img src="./docs/img/code.png" alt="alt text" width="200"/>

If you cannot join the WeChat group, you can add

<img src="./docs/img/self.png" alt="alt text" width="200"/>

## Star History

<a href="https://star-history.com/?utm_source=bestxtools.com#we0-dev/we0&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date" />
 </picture>
</a>
