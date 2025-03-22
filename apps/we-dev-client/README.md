# 超级大坑

当你满心欢喜使用了`pnpm i`安装好了依赖，一定报错，请按照如下方法修复

- electron 修复：https://github.com/pangxieju/electron-fix
- mac 配置修改：

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

# 🛠️ Windows 下 `node-pty` 依赖安装解决方案 

<span style="color: #3498db; font-weight: 600;">⚠️ 注意：</span> 
本方案适用于 Windows 10/11 环境

##  解决方案: https://xx650y5okv0.feishu.cn/docx/V1S8dbasvozR09xfvH3cJ22anYg?from=from_copylink
  
