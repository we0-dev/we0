import { useFileStore } from "../WeIde/stores/fileStore";
import JSZip from "jszip";
import { OpenDirectoryButton } from "../OpenDirectoryButton";
import { useTranslation } from "react-i18next";
import useChatModeStore from "@/stores/chatModeSlice";
import { ChatMode } from "@/types/chat";
import useTerminalStore from "@/stores/terminalSlice";
import { getWebContainerInstance } from "../WeIde/services/webcontainer";
import { useState } from "react";
import { toast } from "react-toastify";

async function tryExec(getEndTerminal: any, cmd: string) {
  const res = await getEndTerminal().executeCommand(cmd);
  return res?.exitCode === 0;
}

async function ensureInstallAndBuild(getEndTerminal: any) {
  // Try pnpm
  if (await tryExec(getEndTerminal, "pnpm -v")) {
    if (!(await tryExec(getEndTerminal, "pnpm run build"))) {
      await tryExec(getEndTerminal, "pnpm install --ignore-scripts");
      if (await tryExec(getEndTerminal, "pnpm run build")) return true;
    } else return true;
  }

  // Try npm
  if (await tryExec(getEndTerminal, "npm -v")) {
    if (!(await tryExec(getEndTerminal, "npm run build"))) {
      (await tryExec(getEndTerminal, "npm ci")) || (await tryExec(getEndTerminal, "npm install"));
      if (await tryExec(getEndTerminal, "npm run build")) return true;
    } else return true;
  }

  // Try yarn
  if (await tryExec(getEndTerminal, "yarn -v")) {
    if (!(await tryExec(getEndTerminal, "yarn build"))) {
      await tryExec(getEndTerminal, "yarn install");
      if (await tryExec(getEndTerminal, "yarn build")) return true;
    } else return true;
  }

  return false;
}

async function detectOutputDir(webcontainer: any): Promise<string | null> {
  const candidates = ["dist", "build", "out", ".next/out", "public"].filter(Boolean);
  for (const dir of candidates) {
    try {
      const stat = await webcontainer.fs.stat(dir);
      if (stat?.type === "dir") return dir;
    } catch {}
  }
  return null;
}


// 添加一个递归获取文件的辅助函数
const getAllFiles = async (webcontainer: any, dirPath: string, zip: JSZip, baseDir: string = '') => {
  try {
    const entries = await webcontainer.fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = `${dirPath}/${entry.name}`;
      try {
        if (entry.isDirectory()) {
          // 如果是目录，递归处理
          await getAllFiles(webcontainer, fullPath, zip, `${baseDir}${entry.name}/`);
        } else {
          // 如果是文件，读取内容并添加到zip
          const content = await webcontainer.fs.readFile(fullPath);
          const relativePath = `${baseDir}${entry.name}`;
          console.log('Adding file:', relativePath);
          zip.file(relativePath, content);
        }
      } catch (error) {
        console.error(`处理文件 ${entry.name} 失败:`, error);
      }
    }
  } catch (error) {
    console.error(`读取目录 ${dirPath} 失败:`, error);
    
    // 如果不支持 withFileTypes，尝试普通的 readdir
    const files = await webcontainer.fs.readdir(dirPath);
    
    for (const file of files) {
      const fullPath = `${dirPath}/${file}`;
      try {
        // 尝试读取文件内容
        const content = await webcontainer.fs.readFile(fullPath);
        const relativePath = `${baseDir}${file}`;
        console.log('Adding file:', relativePath);
        zip.file(relativePath, content);
      } catch (error) {
        // 如果读取失败，可能是目录，尝试递归
        try {
          await getAllFiles(webcontainer, fullPath, zip, `${baseDir}${file}/`);
        } catch (dirError) {
          console.error(`处理文件/目录 ${file} 失败:`, dirError);
        }
      }
    }
  }
};

export function HeaderActions() {
  const { files } = useFileStore();
  const { t } = useTranslation();
  const { getTerminal, newTerminal, getEndTerminal } = useTerminalStore();
  const { mode } = useChatModeStore();
  const [showModal, setShowModal] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      Object.entries(files).forEach(([path, content]) => {
        // 打包dist目录
        zip.file(path, content as string);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "project.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("下载失败:", error);
    }
  };
  const publish = async () => {
    setIsDeploying(true);
    const API_BASE = process.env.APP_BASE_URL;
    
    try {
      const webcontainer = await getWebContainerInstance();
      // Validate package.json and build script
      try {
        const pkgRaw = await webcontainer.fs.readFile("package.json", "utf-8");
        const pkg = JSON.parse(pkgRaw || "{}");
        if (!pkg?.scripts?.build) {
          toast.error(t('header.error.missing_build_script') || 'No "build" script found in package.json');
          setIsDeploying(false);
          return;
        }
      } catch {
        toast.error(t('header.error.missing_package_json') || 'package.json not found');
        setIsDeploying(false);
        return;
      }

      newTerminal(async () => {
        toast.info(t('header.build.start') || 'Building project...');
        const ok = await ensureInstallAndBuild(getEndTerminal);
        if (!ok) {
          toast.error(t('header.error.build_failed') || 'Build failed. Check console logs.');
          setIsDeploying(false);
          return;
        }

        try {
          const zip = new JSZip();
          // Detect output dir
          const outDir = await detectOutputDir(webcontainer);
          if (!outDir) {
            toast.error(t('header.error.output_not_found') || 'Build output folder not found');
            setIsDeploying(false);
            return;
          }
          // 使用新的递归函数获取所有文件
          await getAllFiles(webcontainer, outDir, zip);

          // 生成并下载 zip 文件
          const blob = await zip.generateAsync({ type: "blob" });
          const formData = new FormData();
          formData.append('file', new File([blob], 'dist.zip', { type: 'application/zip' }));
          
          // 发送请求
          const response = await fetch(`${API_BASE}/api/deploy`, {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          
          if(data.success){
            setDeployUrl(data.url);
            setShowModal(true);
            toast.success(t('header.deploySuccess'));
          }
        } catch (error) {
          console.error("读取 dist 目录失败:", error);
          toast.error(t('header.error.deploy_failed'));
        } finally {
          setIsDeploying(false);
        }
      });
    } catch (error) {
      console.error("部署失败:", error);
      toast.error(t('header.error.deploy_failed'));
      setIsDeploying(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(deployUrl);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {mode === ChatMode.Builder && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>{t("header.download")}</span>
          </button>
          {!window.electron && (
            <button
              onClick={publish}
              disabled={isDeploying}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-white rounded-lg transition-colors ${
                isDeploying 
                  ? 'bg-purple-400 dark:bg-purple-500 opacity-75 cursor-not-allowed' 
                  : 'bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600'
              }`}
            >
              {isDeploying ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}
              <span>{isDeploying ? t('header.deploying') : t('header.deploy')}</span>
            </button>
          )}
          {window.electron && <OpenDirectoryButton />}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('header.deploySuccess')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t('header.deployToCloud')}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {t('header.accessLink')}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={deployUrl}
                  readOnly
                  className="flex-1 p-2 text-sm border rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-white dark:bg-gray-500 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {t('header.copy')}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {t('header.close')}
              </button>
              <button
                onClick={() => window.open(deployUrl, '_blank')}
                className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <span>{t('header.visitSite')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

