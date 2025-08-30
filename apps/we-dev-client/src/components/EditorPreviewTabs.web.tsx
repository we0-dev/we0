import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChatMode } from "@/types/chat";
import useChatModeStore from "@/stores/chatModeSlice";

const EditorPreviewTabs: React.FC = () => {
  const [showIframe, setShowIframe] = useState<string>("editor");
  const [frameStyleMap, setFrameStyleMap] = useState<Record<string, string>>({
    editor: "translate-x-0 opacity-100",
    weApi: "translate-x-full opacity-100",
    preview: "translate-x-full opacity-100",
    diff: "translate-x-full opacity-100"
  });
  const { t } = useTranslation();
  const { mode } = useChatModeStore();

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

  // Web-specific content
  const renderWebContent = (tab: string) => {
    switch (tab) {
      case 'editor':
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-8">
            <div className="text-center max-w-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">💻</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Code Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                The full-featured code editor with syntax highlighting, autocomplete, and AI assistance 
                is available in the desktop application. Experience the power of intelligent code generation 
                and real-time collaboration.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Syntax highlighting for 100+ languages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI-powered code completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Integrated debugging tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Real-time collaboration</span>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://we0.ai/download', '_blank')}
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Download Desktop App
              </button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-8">
            <div className="text-center max-w-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">👁️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Live Preview
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                See your changes in real-time with the integrated preview system. Test your applications 
                instantly without switching between tools. Perfect for web development and UI design.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Real-time preview updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Multiple device simulation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Interactive debugging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Performance monitoring</span>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://we0.ai/download', '_blank')}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Full Preview Experience
              </button>
            </div>
          </div>
        );

      case 'weApi':
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-8">
            <div className="text-center max-w-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">🔌</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                WeChat API Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Seamlessly integrate with WeChat Mini Program development. Test APIs, manage projects, 
                and deploy directly to WeChat's ecosystem with built-in tools and templates.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">WeChat DevTools integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">API testing and validation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mini Program templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Direct deployment</span>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://we0.ai/download', '_blank')}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start WeChat Development
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Buttons */}
      <div className="flex border-b border-[#e4e4e4] dark:border-[#333] bg-[#f8f8f8] dark:bg-[#1a1a1a]">
        <TabButton
          active={showIframe === "editor"}
          onClick={() => onToggle("editor")}
          icon={<EditorIcon />}
          label={t("Editor") || "Editor"}
        />
        <TabButton
          active={showIframe === "preview"}
          onClick={() => onToggle("preview")}
          icon={<PreviewIcon />}
          label={t("Preview") || "Preview"}
        />
        <TabButton
          active={showIframe === "weApi"}
          onClick={() => onToggle("weApi")}
          icon={<ApiIcon />}
          label={t("API") || "API"}
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
          {renderWebContent('editor')}
        </div>
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
      ${frameStyleMap["preview"]}
        `}
        >
          {renderWebContent('preview')}
        </div>
        <div
          className={`
          absolute inset-0
          transform transition-all duration-500 ease-in-out
          ${frameStyleMap["weApi"]}
        `}
        >
          {renderWebContent('weApi')}
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