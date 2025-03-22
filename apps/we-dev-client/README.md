[![English](https://img.shields.io/badge/README-English-494cad.svg)](https://github.com/we0-dev/we0/blob/main/apps/we-dev-client/README.md) [![中文](https://img.shields.io/badge/README-中文-494cad.svg)](https://github.com/we0-dev/we0/blob/main/apps/we-dev-client/docs/README.zh.md) 

# Super big pit

When you are happy to use 'pnpm i' to install the dependency, it will definitely report an error; please follow the steps below to fix it.

- electron fix：https://github.com/pangxieju/electron-fix
- mac Configuration modifications：

```
"postinstall": "electron-rebuild -f -w node-pty --arch=arm64"
"mac": {
      "target": "dir",
      "arch": [
        "arm64"
      ]
    }
```

- windows:

# 🛠️ Windows `node-pty` Dependency Installation Guide 

<span style="color: #3498db; font-weight: 600;">⚠️ Important Notice:</span>  
This solution applies to Windows 10/11 environments

## 🚀 Visual Studio Installer Setup

### 1. [Official Download](https://visualstudio.microsoft.com/zh-hans/downloads/)

### 2. Custom Installation Path
- For existing VS installations needing path modification:
  1. Press `WIN + R` to open Registry Editor
  2. Navigate to:  
     `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\VisualStudio\Setup`
  3. Modify/Delete `SharedInstallationPath` value  
     Example: `D:\software\Microsoft\VisualStudio\Shared`

### 3. Component Selection

  - ☑️ C++ Desktop Development
  - ☑️ Python Development
  - ☑️ Python 3 64-bit
  - ☑️ MSVC v142 or newer (VS Tool Installation Interface - Single Component - Search for MSVC)
  - ☑️ CMake (Bundled version)

## 4. Configure the Python environment

* &#x20; In the Path environment variable, add python.exe path and pip.exe path

* Verify the Python environment
```bash
    python --V
    pip --V
```

## 5. Install dependencies (stable node version recommended)
* Delete the original node_modules
  ```bash
    rm -rf node_modules
    pnpm install
  ```
* If you run into peer-to-peer dependency issues
  ```bash
    pnpm install --legacy-peer-deps
  ```
