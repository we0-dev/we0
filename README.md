[![English](https://img.shields.io/badge/README-English-494cad.svg)](https://github.com/we0-dev/we0/blob/main/README.md) [![中文](https://img.shields.io/badge/README-中文-494cad.svg)](https://github.com/we0-dev/we0/blob/main/docs/README.zh.md) 

# we0

## What is We0

![alt text](./docs/img/image-1.png)

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
| Design-to-code conversion                  | ✅  | ✅  | ❌       |
| Open-source                                | ✅  | ❌  | ✅       |
| Supports WeChat Mini Program Tools preview | ✅  | ❌  | ❌       |
| Supports existing projects                 | ✅  | ❌  | ❌       |
| Supports Deepseek                          | ✅  | ❌  | ❌       |

## Get Started

This project uses pnpm as the package management tool. Ensure your Node.js version is 18.20 or higher.

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
cd apps/we-dev-next
pnpm install

```

- Configure environment variables

Rename .env.example to .env and fill in the corresponding content.

```shell
# Client apps/we-dev-client/.env.example

# SERVER_ADDRESS [MUST*] (eg: http://localhost:3000)
APP_BASE_URL=

# JWT_SECRET [Optional]
JWT_SECRET=

# Servers apps/we-dev-next/.env.example

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

How to Use the Client Version?

- mac version
  1. Go to https://we0.ai/.
  2. Select Download for Mac to download the installer.
  3. You might encounter an issue:
  
     ![alt text](./docs/img/image-2.png)
     
- Open Launchpad, select Terminal, and enter:
  ```bash
  sudo spctl  --master-disable
  ```
  then press Enter, enter your password (the password input is invisible), and press Enter again.
  
  Next, open System Preferences, select Security & Privacy, then General, and you will see Anywhere selected.
  Then open the file to install.
  ![alt text](./docs/img/image-3.png)


- If it still shows "Damaged and cannot be opened. You should move it to the Trash" 

  don't worry. Use the following method:

  Copy and paste the command in the terminal (note the space at the end):

  ```bash
  sudo xattr -r -d com.apple.quarantine
  ```

  **Do not press Enter yet! Do not press Enter yet! Do not press Enter yet! Do not press Enter yet!**

  Then open Finder, go to the Applications directory, find the software icon, and drag it into the terminal window. You will get a combination like this (as shown in the image):

  ```bash
  sudo xattr -r -d com.apple.quarantine /Applications/WebStrom.app 
  ```

  Return to the terminal window, press Enter, and enter your system password to proceed.


## Question
- If electron reports an error during the second run, please delete the client workspace
- electron If there is no preview when starting, run pnpm run electron:dev

## Contact US

send email to <a href="mailto:enzuo@wegc.cn">enzuo@wegc.cn</a>


## Star History

<a href="https://star-history.com/?utm_source=bestxtools.com#we0-dev/we0&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=we0-dev/we0&type=Date" />
 </picture>
</a>
