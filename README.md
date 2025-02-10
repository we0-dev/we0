[![English](https://img.shields.io/badge/README-English-494cad.svg)](https://github.com/we0-dev/we0/blob/main/README.md) [![中文](https://img.shields.io/badge/README-中文-494cad.svg)](https://github.com/we0-dev/we0/blob/main/README.zh.md) 

# we-dev

## What is We-dev

![alt text](image-1.png)

## What Makes We0 Different?

Currently, Cursor, v0, and Bolt.new have impressive performance in web project generation. The We0 project has the following features:

Supports browser-based debugging: Built-in WebContainer environment allows you to run a terminal in the browser, install and run npm and tool libraries.

High-fidelity design restoration: Utilizes cutting-edge D2C technology to achieve 99% design restoration.

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
cd apps/we-dev/we-dev-next
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

# Third-Party Model URL [MUST*] (eg: https://api2.aigcbest.top/v1)
THIRD_API_URL=

# Third-Party Model API-Key [MUST*] (eg:sk-xxxx)
THIRD_API_KEY=

# JWT_SECRET [Optional]
JWT_SECRET=

# MongoDB_URI
MONGODB_URI=
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

The repair process is as follows:

1. Globally install the repair tool (Note: Install globally, not in the project!)

```bash
npm install electron-fix -g
```

2. Execute the repair command in the project root directory

```bash
electron-fix start
```

3. Re-run the installation command

```bash
pnpm install
```

### Node-pty Issue

For different platforms, the compilation environment for node-pty needs to be modified.

- Mac configuration modification:

```json
"postinstall": "electron-rebuild -f -w node-pty --arch=arm64"
"mac": {
      "target": "dir",
      "arch": [
        "arm64"
      ]
    }
```

## Development Standards

The project directory structure is as follows:

- apps
  - we-dev-client：client（electron）
  - we-dev-next：backend services

## How to Install and Use

How to Use the Client Version?

- mac version
  1. Go to https://we0.ai/.
  2. Select Download for Mac to download the installer.
  3. You might encounter an issue:
     ![alt text](image-2.png)
- Open Launchpad, select Terminal, and enter:
  `sudo spctl  --master-disable`
  hen press Enter, enter your password (the password input is invisible), and press Enter again.
  Next, open System Preferences, select Security & Privacy, then General, and you will see Anywhere selected.
  ![alt text](image-3.png)

Then open the file to install.
If it still shows "Damaged and cannot be opened. You should move it to the Trash," don't worry. Use the following method:
Copy and paste the command in the terminal (note the space at the end):
sudo xattr -r -d com.apple.quarantine
Do not press Enter yet! Do not press Enter yet! Do not press Enter yet! Do not press Enter yet!
Then open Finder, go to the Applications directory, find the software icon, and drag it into the terminal window. You will get a combination like this (as shown in the image):
sudo xattr -r -d com.apple.quarantine /Applications/WebStrom.app
Return to the terminal window, press Enter, and enter your system password to proceed.

## Contact US

send email to <a href="mailto:enzuo@wegc.cn">enzuo@wegc.cn</a>
