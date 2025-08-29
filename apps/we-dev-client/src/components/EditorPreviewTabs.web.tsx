import { useState } from "react";
import { useTranslation } from "react-i18next";

const EditorPreviewTabs: React.FC = () => {
  const [showIframe, setShowIframe] = useState<string>("editor");
  const [frameStyleMap, setFrameStyleMap] = useState<Record<string, string>>({
    editor: "translate-x-0 opacity-100",
    weApi: "translate-x-full opacity-100",
    preview: "translate-x-full opacity-100",
    diff: "translate-x-full opacity-100"
  });
  const { t } = useTranslation();

  const onToggle = (tab: string) => {
    setFrameStyleMap(prev => {
      const newMap = { ...prev };
      Object.keys(newMap).forEach(key => {
        if (key === tab) {
          newMap[key] = "translate-x-0 opacity-100";
        } else {
          newMap[key] = "translate-x-full opacity-100";
        }
      });
      return newMap;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Buttons */}
      <div className="flex border-b border-[#e4e4e4] dark:border-[#333] bg-[#f8f8f8] dark:bg-[#1a1a1a]">
        <TabButton
          active={showIframe === "editor"}
          onClick={() => onToggle("editor")}
          icon={<EditorIcon />}
          label={t("Editor")}
        />
        <TabButton
          active={showIframe === "preview"}
          onClick={() => onToggle("preview")}
          icon={<PreviewIcon />}
          label={t("Preview")}
        />
        <TabButton
          active={showIframe === "weApi"}
          onClick={() => onToggle("weApi")}
          icon={<ApiIcon />}
          label={t("API")}
        />
      </div>

      {/* Content Area */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
      ${frameStyleMap["editor"]}
        `}
        >
          <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Web Editor
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                The full editor is available in the desktop application
              </p>
            </div>
          </div>
        </div>
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
      ${frameStyleMap["preview"]}
        `}
        >
          <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Preview
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Preview functionality is available in the desktop application
              </p>
            </div>
          </div>
        </div>
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
          ${frameStyleMap["weApi"]}
        `}
        >
          <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                WeChat API
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                API functionality is available in the desktop application
              </p>
            </div>
          </div>
        </div>
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
    <path
      d="M7 17L17 17"
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
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ApiIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EditorPreviewTabs;