import { useTranslation } from "react-i18next";
import useChatModeStore from "@/stores/chatModeSlice";
import { ChatMode } from "@/types/chat";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaCode, FaDownload, FaGithub, FaQuestionCircle } from "react-icons/fa";

function HeaderActions() {
  const { t } = useTranslation();
  const { mode, setMode } = useChatModeStore();
  const [isWebMode] = useState(!window?.electron);

  const handleModeChange = (newMode: ChatMode) => {
    if (isWebMode && newMode === ChatMode.Builder) {
      toast.info("Builder mode requires the desktop application for full functionality");
      return;
    }
    setMode(newMode);
  };

  const handleDownload = () => {
    window.open('https://we0.ai/download', '_blank');
  };

  const handleHelp = () => {
    window.open('https://we0.ai/docs', '_blank');
  };

  const handleGitHub = () => {
    window.open('https://github.com/ai-hub-2/we', '_blank');
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Mode Toggle */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => handleModeChange(ChatMode.Chat)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === ChatMode.Chat
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <span className="mr-2">💬</span>
          {t("Chat") || "Chat"}
        </button>
        <button
          onClick={() => handleModeChange(ChatMode.Builder)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            mode === ChatMode.Builder
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          title={isWebMode ? "Builder mode requires desktop app" : "Switch to Builder mode"}
        >
          <span className="mr-2">🔧</span>
          {t("Builder") || "Builder"}
        </button>
      </div>

      {/* Web Mode Indicator */}
      {isWebMode && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <span className="text-blue-600 dark:text-blue-400 text-sm">🌐</span>
          <span className="text-blue-700 dark:text-blue-300 text-xs font-medium">Web</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        <button
          onClick={handleDownload}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Download Desktop App"
        >
          <FaDownload className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleHelp}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Help & Documentation"
        >
          <FaQuestionCircle className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleGitHub}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="View on GitHub"
        >
          <FaGithub className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default HeaderActions;