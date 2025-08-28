import PreviewIframe from "./PreviewIframe";
import { useState } from "react";
import { useFileStore } from "./WeIde/stores/fileStore";
import WeIde from "./WeIde";
import useTerminalStore from "@/stores/terminalSlice";
import WeAPI from "./WeAPI";
import { useTranslation } from "react-i18next";
// import { Diff } from "./Diff";

const ipcRenderer = window?.electron?.ipcRenderer;

// Find WeChat DevTools path
export async function findWeChatDevToolsPath() {
  try {
    // Get operating system type through IPC call to main process
    const platform = await ipcRenderer.invoke("node-container:platform");
    console.log(platform, "platform");
    if (platform === "win32") {
      // Windows platform
      const defaultPath =
        process.env.Path.split(";")
          .find((value) => {
            value.includes("WeChat Web DevTools");
          })
          .split("WeChat Web DevTools")[0] + "WeChat Web DevTools/cli.bat";

      try {
        // Check if file exists
        await ipcRenderer.invoke(
          "node-container:check-file-exists",
          defaultPath
        );
        return defaultPath;
      } catch {
        // If default path doesn't exist, use where command to find
        const result = await ipcRenderer.invoke(
          "node-container:exec-command",
          "where cli.bat"
        );
        if (!result.trim()) {
          throw new Error("WeChat DevTools path not found");
        }
        return result.trim();
      }
    } else if (platform === "darwin") {
      // macOS platform
      const defaultPath =
        "/Applications/wechatwebdevtools.app/Contents/MacOS/cli";

      try {
        // Check if file exists
        await ipcRenderer.invoke(
          "node-container:check-file-exists",
          defaultPath
        );
        return defaultPath;
      } catch {
        // If default path doesn't exist, use find command to search globally
        const result = await ipcRenderer.invoke(
          "node-container:exec-command",
          'find / -name "cli" -type f 2>/dev/null'
        );

        const paths = result
          .split("\n")
          .filter((path) => path.includes("wechatwebdevtools.app"));
        if (paths.length > 0) {
          return paths[0];
        }
        throw new Error("WeChat DevTools path not found");
      }
    } else {
      throw new Error("Unsupported operating system");
    }
  } catch (error) {
    throw new Error(`Failed to find WeChat DevTools: ${error.message}`);
  }
}
const EditorPreviewTabs: React.FC = () => {
  const { getFiles, projectRoot,oldFiles,files } = useFileStore();
  const [showIframe, setShowIframe] = useState<string>("editor");
  const [frameStyleMap, setFrameStyleMap] = useState<Record<string, string>>({
    editor: "translate-x-0 opacity-100",
    weApi: "translate-x-full opacity-100",
    preview: "translate-x-full opacity-100",
    diff: "translate-x-full opacity-100"
  });
  const { t } = useTranslation();

  const isMinPrograme = getFiles().includes("app.json");

  const openWeChatEditor = async () => {
    if (!window.electron) {
      console.error("Electron not available");
      return;
    }

    try {
      const cliPath = await findWeChatDevToolsPath();   
      if (getFiles().includes("app.json") || getFiles().includes("miniprogram/app.json")) {
        const defaultRoot = await ipcRenderer.invoke(
          "node-container:get-project-root"
        );
        const command = `"${cliPath}" -o "${projectRoot || defaultRoot}" --auto-port`;
        await ipcRenderer.invoke("node-container:exec-command", command);
      }
    } catch (error) {
      console.error("Failed to open WeChat editor:", error);
    }
  };

  const onToggle = (name) => {
    setShowIframe(name);
    const newFrameStyleMap = { ...frameStyleMap };
    Object.keys(newFrameStyleMap).forEach((key) => {
      newFrameStyleMap[key] = "translate-x-full opacity-100";
    });
    newFrameStyleMap[name] = "translate-x-0 opacity-100";
    setFrameStyleMap(newFrameStyleMap);
  };

  return (
    <div className="m-1.5 flex-1 relative flex flex-col">
      <div className="flex h-10 gap-0.5 bg-[#f3f3f3] dark:bg-[#1a1a1a] pl-0 pt-1 rounded-t-lg justify-between border-b border-[#e4e4e4] dark:border-[#333]">
        <div className="flex-1 flex">
          <TabButton
            active={showIframe == "editor" || !showIframe}
            onClick={() => {
              onToggle("editor");
            }}
            icon={<EditorIcon />}
            label={t("editor.editor")}
          />
          <TabButton
            active={showIframe == "preview"}
            onClick={() => {
              onToggle("preview");
              openWeChatEditor();
            }}
            icon={<PreviewIcon />}
            label={t("editor.preview")}
          />
          {/* <TabButton
            active={showIframe == "diff"}
            onClick={() => {
              onToggle("diff");
            }}
            icon={<APITestIcon />}
            label={t("editor.diff")}
          /> */}
          <TabButton
            active={showIframe == "weApi"}
            onClick={() => {
              onToggle("weApi");
            }}
            icon={<APITestIcon />}
            label={t("editor.apiTest")}
          />
          
        </div>

        {/* <div className="flex items-center gap-2 mr-2">
          {(window as any).electron && <OpenDirectoryButton />}
        </div> */}
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
      ${frameStyleMap["editor"]}
        `}
        >
          <WeIde /> 
        </div>
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
      ${frameStyleMap["preview"]}
        `}
        >
          <PreviewIframe
            isMinPrograme={isMinPrograme}
            setShowIframe={(show) => {
              onToggle("preview");
              setShowIframe(show ? "preview" : "");
            }}
          />
        </div>
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
          ${frameStyleMap["weApi"]}
        `}
        >
          <WeAPI />
        </div>
         {/* <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
          ${frameStyleMap["diff"]}
        `}
        >
           <Diff oldFiles={oldFiles} newFiles={files} />
        </div> */}
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <div
    onClick={onClick}
    className={`
      px-4 cursor-pointer flex items-center gap-2 text-[13px] rounded-t-md
      transition-all duration-400 ease-in-out min-w-[100px] h-9
      hover:bg-[#e8e8e8] dark:hover:bg-[#2c2c2c] hover:text-[#333] dark:hover:text-white
      ${
        active
          ? "bg-white dark:bg-[#333333] text-[#333] dark:text-white font-medium border-t border-x border-[#e4e4e4] dark:border-[#333] shadow-sm"
          : "bg-transparent text-[#616161] dark:text-[#888]"
      }
    `}
  >
    {icon}
    <span className="translate">{label}</span>
  </div>
);

const EditorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3L21 3V21H3L3 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 7L17 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 12L17 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PreviewIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 7L12 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 12L17 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const APITestIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* API text box */}
    <rect
      x="3"
      y="6"
      width="18"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Left bracket { */}
    <path
      d="M8 10L7 12L8 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right bracket } */}
    <path
      d="M16 10L17 12L16 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Middle dot */}
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export default EditorPreviewTabs;
