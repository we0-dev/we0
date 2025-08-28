import useThemeStore from "@/stores/themeSlice";
import { useState, useEffect, useRef } from "react";
import useChatStore from "@/stores/chatSlice";
import i18n from "@/utils/i18";

import { useTranslation } from "react-i18next";
import { Switch, Select, Input, Radio, message } from "antd";
import { BackendSettings } from "./BackendSettings";
import classNames from "classnames";
import { useAIProviderStore } from "@/stores/aiProviderSlice";
import { fetchModelsForProvider } from "@/api/models";

interface OtherConfig {
  isBackEnd: boolean;
  backendLanguage: string;
  extra: {
    isOpenDataBase: boolean;
    database: string;
    databaseConfig: {
      url: string;
      username: string;
      password: string;
    };
    isOpenCache: boolean;
    cache: string;
  };
}

interface FormData {
  language?: string;
  ollamaUrl?: string;
  apiKey?: string;
  proxyType: 'none' | 'system' | 'custom';
  customProxy: string;
  pythonMirror: string;
  customPythonMirror: string;
  nodeMirror: string;
  customNodeMirror: string;
}

// 自定义 Select 组件
const CustomSelect = ({ value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          "w-full px-3 py-2 text-sm text-left rounded-md",
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-700/50",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
          "transition-colors duration-200",
          "flex items-center justify-between gap-2",
          className
        )}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={classNames(
          "absolute z-50 w-full mt-1 rounded-md shadow-lg",
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        )}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={classNames(
                "w-full px-3 py-2 text-sm text-left",
                "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                "transition-colors duration-200",
                value === option.value && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 自定义 Input 组件
const CustomInput = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={classNames(
      "w-full px-3 py-2 text-sm rounded-md",
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
      "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
      "placeholder-gray-400 dark:placeholder-gray-500",
      "transition-colors duration-200",
      className
    )}
  />
);

// 添加自定义 Radio 组件
const CustomRadio = ({ checked, onChange, children, value }) => (
  <button
    onClick={() => onChange({ target: { value } })}
    className={classNames(
      "flex items-center gap-2 px-3 py-2 w-full text-sm rounded-md",
      "transition-colors duration-200",
      checked
        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      "border hover:bg-gray-50 dark:hover:bg-gray-700/50"
    )}
  >
    <div className={classNames(
      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
      checked
        ? "border-purple-500 dark:border-purple-400"
        : "border-gray-300 dark:border-gray-600"
    )}>
      {checked && (
        <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
      )}
    </div>
    <span>{children}</span>
  </button>
);

// 添加自定义多行输入框组件
const CustomTextArea = ({ value, onChange, placeholder, className = "" }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={4}
    className={classNames(
      "w-full px-3 py-2 text-sm rounded-md",
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
      "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
      "placeholder-gray-400 dark:placeholder-gray-500",
      "transition-colors duration-200",
      "resize-y min-h-[100px]",
      className
    )}
  />
);

export function GeneralSettings() {
  const { t } = useTranslation();
  const { setOtherConfig, otherConfig } = useChatStore();
  const { isDarkMode, toggleTheme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = JSON.parse(localStorage.getItem('settingsConfig') || '{}');
    return {
      ...savedData,
      proxyType: savedData.proxyType || 'none',
      customProxy: savedData.customProxy || '',
      pythonMirror: savedData.pythonMirror || 'https://pypi.org/simple',
      customPythonMirror: savedData.customPythonMirror || '',
      nodeMirror: savedData.nodeMirror || 'https://registry.npmjs.org/',
      customNodeMirror: savedData.customNodeMirror || '',
      language: savedData.language || 'en'
    };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "system"
  );

  const {
    provider,
    apiKeys,
    availableModels,
    selectedModel,
    setProvider,
    setApiKey,
    setAvailableModels,
    setSelectedModel,
    hydrateFromStorage,
  } = useAIProviderStore();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const providerOptions = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google (Gemini)" },
    { value: "groq", label: "Groq" },
    { value: "deepseek", label: "DeepSeek" },
    { value: "ollama", label: "Ollama (Local)" },
    { value: "azure-openai", label: "Azure OpenAI" },
    { value: "mistral", label: "Mistral" },
    { value: "cohere", label: "Cohere" },
    { value: "perplexity", label: "Perplexity" },
    { value: "together", label: "Together" },
    { value: "huggingface", label: "Hugging Face" },
    { value: "fireworks", label: "Fireworks" },
    { value: "openrouter", label: "OpenRouter" },
    { value: "xai", label: "xAI" },
    { value: "deepinfra", label: "DeepInfra" },
    { value: "replicate", label: "Replicate" },
  ];

  const providerDocs: Record<string, string> = {
    "openai": "https://platform.openai.com/docs/api-reference",
    "anthropic": "https://docs.anthropic.com/en/api",
    "google": "https://ai.google.dev/gemini-api/docs",
    "groq": "https://console.groq.com/docs/overview",
    "deepseek": "https://api-docs.deepseek.com",
    "ollama": "https://github.com/ollama/ollama/blob/main/docs/api.md",
    "azure-openai": "https://learn.microsoft.com/azure/ai-services/openai/reference",
    "mistral": "https://docs.mistral.ai/api/",
    "cohere": "https://docs.cohere.com/reference",
    "perplexity": "https://docs.perplexity.ai",
    "together": "https://docs.together.ai/docs/introduction",
    "huggingface": "https://huggingface.co/docs/api-inference/index",
    "fireworks": "https://readme.fireworks.ai/reference",
    "openrouter": "https://openrouter.ai/docs",
    "xai": "https://docs.x.ai/docs/api-reference",
    "deepinfra": "https://deepinfra.com/docs",
    "replicate": "https://replicate.com/docs/reference/http",
  };

  const handleProviderChange = async (newProvider: any) => {
    setProvider(newProvider);
    try {
      const key = apiKeys[newProvider as keyof typeof apiKeys] || "";
      const models = await fetchModelsForProvider(newProvider, key);
      setAvailableModels(models);
      setSelectedModel(models[0]);
      const needsKey = ["openai", "anthropic", "google", "groq", "azure-openai"].includes(newProvider);
      if (needsKey && !key) {
        message.warning("Please set API key for the selected provider.");
      } else if (needsKey && (!models || models.length === 0)) {
        message.error("Failed to load models. Check API key/permissions.");
      }
    } catch (e) {
      message.error("Error loading models for provider.");
      setAvailableModels([]);
      setSelectedModel(undefined);
    }
  };

  const handleApiKeyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value.trim();
    // Auto-detect provider by key prefix when possible
    const detected = key.startsWith("sk-or-") ? "openrouter"
      : key.startsWith("sk-") && provider !== "openrouter" ? provider
      : provider;
    if (detected !== provider) {
      setProvider(detected as any);
    }
    setApiKey(detected as any, key);
    try {
      const models = await fetchModelsForProvider(detected as any, key);
      setAvailableModels(models);
      if (!models.includes(selectedModel || "")) setSelectedModel(models[0]);
      if (!models || models.length === 0) {
        message.warning("No models returned. Verify API key/plan.");
      }
    } catch {
      message.error("Failed to fetch models. Check API key.");
      setAvailableModels([]);
      setSelectedModel(undefined);
    }
  };
  const handleSaveApi = () => {
    try {
      localStorage.setItem('aiProviderConfig', JSON.stringify({ provider, apiKeys, selectedModel }));
      message.success('API settings saved');
      // Force refresh models after save
      handleProviderChange(provider);
    } catch {
      message.error('Failed to save settings');
    }
  };

  useEffect(() => {
    localStorage.setItem("settingsConfig", JSON.stringify(formData));
  }, [formData]);

  // Load theme settings from local storage when component mounts
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (currentTheme === "system") {
        setTheme(e.matches);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // 初始化主题
    if (currentTheme === "system") {
      setTheme(mediaQuery.matches);
    } else {
      setTheme(currentTheme === "dark");
    }

    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [currentTheme]);

  useEffect(() => {
    const savedOtherConfig = localStorage.getItem("otherConfig");
    if (savedOtherConfig) {
      try {
        const config = JSON.parse(savedOtherConfig);
        setOtherConfig({
          isBackEnd: config.isBackEnd || false,
          backendLanguage: config.backendLanguage || "java",
          extra: {
            isOpenDataBase: config.extra?.database !== "none",
            database: config.extra?.database || "mysql",
            databaseConfig: {
              url: config.extra?.databaseConfig?.url || "",
              username: config.extra?.databaseConfig?.username || "",
              password: config.extra?.databaseConfig?.password || "",
            },
            isOpenCache: config.extra?.isOpenCache || false,
            cache: config.extra?.cache || "",
          },
        });
      } catch (error) {
        setOtherConfig({
          isBackEnd: false,
          backendLanguage: "java",
          extra: {
            isOpenDataBase: false,
            database: "mysql",
            databaseConfig: {
              url: "",
              username: "",
              password: "",
            },
            isOpenCache: false,
            cache: "",
          },
        });
        localStorage.removeItem("otherConfig");
      }
    } else {
      setOtherConfig({
        isBackEnd: false,
        backendLanguage: "java",
        extra: {
          isOpenDataBase: false,
          database: "mysql",
          databaseConfig: {
            url: "",
            username: "",
            password: "",
          },
          isOpenCache: false,
          cache: "",
        },
      });
    }
  }, []);

  const updateConfig = (newConfig: any) => {
    setOtherConfig(newConfig);
    localStorage.setItem("otherConfig", JSON.stringify(newConfig));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newConfig: OtherConfig = {
        isBackEnd: otherConfig.isBackEnd || false,
        backendLanguage: otherConfig.backendLanguage || "java",
        extra: {
          isOpenDataBase: otherConfig.extra?.database !== "none",
          database: otherConfig.extra?.database || "mysql",
          databaseConfig: {
            url: otherConfig.extra?.databaseConfig?.url || "",
            username: otherConfig.extra?.databaseConfig?.username || "",
            password: otherConfig.extra?.databaseConfig?.password || "",
          },
          isOpenCache: false,
          cache: "",
        },
      };
      localStorage.setItem("otherConfig", JSON.stringify(newConfig));
      setOtherConfig(newConfig);
      localStorage.setItem(
        "ollamaConfig",
        JSON.stringify({
          url: formData.ollamaUrl || "http://localhost:11434",
          apiKey: formData.apiKey,
        })
      );
    } catch (error) {
      localStorage.setItem(
        "ollamaConfig",
        JSON.stringify({
          url: formData.ollamaUrl || "http://localhost:11434",
          apiKey: formData.apiKey,
        })
      );
    }
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark);
    } else {
      setTheme(theme === "dark");
    }
  };

  // 验证代理地址格式
  const validateProxyUrl = (url: string): boolean => {
    try {
      // 检查基本格式
      if (!url.includes('://')) {
        message.error(t('settings.invalidProxyFormat'));
        return false;
      }

      // 获取协议和剩余部分
      const [protocol, rest] = url.split('://')
      const protocolLower = protocol.toLowerCase()
      const supportedProtocols = ['http', 'https', 'socks4', 'socks5']
      
      if (!supportedProtocols.includes(protocolLower)) {
        message.error(t('settings.unsupportedProxyProtocol'))
        return false
      }

      if (protocolLower.startsWith('socks')) {
        // SOCKS 代理验证
        const socksRegex = /^([^:]+)(?::(\d+))?$/
        const match = rest.match(socksRegex)
        
        if (!match) {
          message.error(t('settings.invalidProxyFormat'))
          return false
        }

        const [, host, port] = match
        
        // 检查主机
        if (!host) {
          message.error(t('settings.invalidProxyHost'))
          return false
        }

        // SOCKS 代理必须有端口
        if (!port) {
          message.error(t('settings.socksPortRequired'))
          return false
        }

        // 验证端口号
        const portNum = parseInt(port, 10)
        if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
          message.error(t('settings.invalidProxyPort'))
          return false
        }
      } else {
        // HTTP/HTTPS 代理验证
        try {
          const proxyUrl = new URL(url)
          
          if (!proxyUrl.hostname) {
            message.error(t('settings.invalidProxyHost'))
            return false
          }
          
          if (proxyUrl.port) {
            const portNum = parseInt(proxyUrl.port, 10)
            if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
              message.error(t('settings.invalidProxyPort'))
              return false
            }
          }
        } catch (e) {
          message.error(t('settings.invalidProxyFormat'))
          return false
        }
      }
      
      return true
    } catch (e) {
      console.error('Proxy validation error:', e)
      message.error(t('settings.invalidProxyFormat'))
      return false
    }
  }

  // 处理代理类型切换
  const handleProxyTypeChange = (newProxyType: 'none' | 'system' | 'custom') => {
    // 保存当前状态到新对象，避免直接修改当前状态
    const newFormData = {
      ...formData,
      proxyType: newProxyType,
    };
    
    // 更新状态
    setFormData(newFormData);
    
    // 应用新的代理设置
    if (newProxyType === 'custom') {
      // 如果切换到自定义代理且有保存的值，立即应用
      if (formData.customProxy) {
        applyProxySettings(newProxyType, formData.customProxy);
      }
    } else {
      // 非自定义代理直接应用
      applyProxySettings(newProxyType);
    }
  };

  // 应用代理设置
  const applyProxySettings = (proxyType: string, customProxy?: string) => {
    try {
      // 对于自定义代理，验证URL格式
      if (proxyType === 'custom' && customProxy) {
        if (!validateProxyUrl(customProxy)) {
          return;
        }
      }

      if (window.electron) {
        // 在 Electron 环境中设置代理
        window.electron.ipcRenderer.send('set-proxy', {
          type: proxyType,
          customProxy: customProxy
        });
        
        // 读取当前存储的设置
        const savedData = JSON.parse(localStorage.getItem('settingsConfig') || '{}');
        
        // 更新设置
        const updatedSettings = {
          ...savedData,
          proxyType: proxyType,
        };
        
        // 只有在自定义代理模式下才更新customProxy值
        if (proxyType === 'custom' && customProxy) {
          updatedSettings.customProxy = customProxy;
        } else {
          // 保留之前的customProxy值
          updatedSettings.customProxy = savedData.customProxy || '';
        }
        
        // 保存更新后的设置
        localStorage.setItem('settingsConfig', JSON.stringify(updatedSettings));
        
        message.success(t('settings.proxyApplied'));
      } else {
        // 在 Web 环境中设置代理
        console.log('Web environment proxy settings will be handled by browser');
        message.success(t('settings.proxyApplied'));
      }
    } catch (error) {
      console.error('Failed to apply proxy settings:', error);
      message.error(t('settings.proxyError'));
    }
  };

  // 处理自定义代理值变更
  const handleCustomProxyChange = (newProxy: string) => {
    // 更新表单状态
    setFormData(prev => ({
      ...prev,
      customProxy: newProxy
    }));
    
    // 使用防抖处理，避免频繁应用设置
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      if (newProxy) {
        applyProxySettings('custom', newProxy);
      }
    }, 500);
  };
  
  // 创建一个ref存储防抖定时器
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Language Select
  const handleLanguageChange = (language: string) => {
    setFormData({ ...formData, language });
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {/* 标签页切换 */}
        <nav className="border-b border-gray-200 dark:border-gray-700">
          <button
            className={classNames(
              "px-4 py-2 text-sm font-medium transition-colors duration-200",
              "focus:outline-none",
              activeTab === 'general'
                ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
            onClick={() => setActiveTab('general')}
          >
            {t("settings.General")}
          </button>
        </nav>

        {/* 设置表单 */}
        <div className="p-4 space-y-6">
          <BackendSettings otherConfig={otherConfig} updateConfig={updateConfig} />

          {/* 主题切换 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("settings.themeMode")}
            </label>
            <CustomSelect
              value={currentTheme}
              onChange={(value) => handleThemeChange(value)}
              options={[
                { value: 'light', label: t("settings.themeModeLight") },
                { value: 'dark', label: t("settings.themeModeDark") },
                ...(!window.electron ? [{ value: 'system', label: t("settings.themeSystem") }] : [])
              ]}
            />
          </div>

          {/* 语言选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("settings.Language")}
            </label>
            <CustomSelect
              value={formData.language}
              onChange={(value) => handleLanguageChange(value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'zh', label: '中文' }
              ]}
            />
          </div>

          {/* Python 镜像设置 */}
          {window.electron && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                MCP {t("settings.pythonMirror")}
            </label>
            <CustomSelect
              value={formData.pythonMirror}
              onChange={(value) => {
                setFormData({ 
                  ...formData, 
                  pythonMirror: value,
                  customPythonMirror: value === 'custom' ? formData.customPythonMirror : ''
                });
              }}
              options={[
                { value: 'https://pypi.org/simple', label: 'PyPI (Official)' },
                { value: 'https://mirrors.aliyun.com/pypi/simple/', label: '阿里云镜像' },
                { value: 'https://pypi.tuna.tsinghua.edu.cn/simple', label: '清华镜像' },
                { value: 'https://mirrors.cloud.tencent.com/pypi/simple', label: '腾讯云镜像' },
                { value: 'custom', label: t('settings.customMirror') }
              ]}
            />
            {formData.pythonMirror === 'custom' && (
              <CustomInput
                placeholder={t('settings.customMirrorPlaceholder')}
                value={formData.customPythonMirror}
                onChange={(e) => setFormData({ ...formData, customPythonMirror: e.target.value })}
              />
            )}
            </div>
          )}

          {/* Node 镜像设置 */}
          {window.electron && (
            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              MCP {t("settings.nodeMirror")}
            </label>
            <CustomSelect
              value={formData.nodeMirror}
              onChange={(value) => {
                setFormData({ 
                  ...formData, 
                  nodeMirror: value,
                  customNodeMirror: value === 'custom' ? formData.customNodeMirror : ''
                });
              }}
              options={[
                { value: 'https://registry.npmjs.org/', label: 'NPM (Official)' },
                { value: 'https://registry.npmmirror.com', label: '淘宝 NPM 镜像' },
                { value: 'https://mirrors.cloud.tencent.com/npm/', label: '腾讯云镜像' },
                { value: 'custom', label: t('settings.customMirror') }
              ]}
            />
            {formData.nodeMirror === 'custom' && (
              <CustomInput
                placeholder={t('settings.customMirrorPlaceholder')}
                value={formData.customNodeMirror}
                onChange={(e) => setFormData({ ...formData, customNodeMirror: e.target.value })}
              />
              )}
            </div>
          )}

          {/* Ollama URL 设置 */}
          {window.electron && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ollama URL
              </label>
              <CustomInput
                placeholder="http://localhost:11434"
                value={formData.ollamaUrl || "http://localhost:11434"}
                onChange={(e) => setFormData({ ...formData, ollamaUrl: e.target.value })}
              />
            </div>
          )}

          {/* API Key 设置 */}
          {window.electron && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("settings.keyPlaceholder")}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className={classNames(
                    "w-full px-3 py-2 text-sm rounded-md pr-10",
                    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                    "placeholder-gray-400 dark:placeholder-gray-500",
                    "transition-colors duration-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={classNames(
                    "absolute right-2 top-1/2 transform -translate-y-1/2",
                    "p-1 rounded-md",
                    "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                    "transition-colors duration-200"
                  )}
                >
                  {showPassword ? (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 代理设置 */}
          {window.electron && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("settings.proxy")}
            </label>
            <div className="space-y-2">
              <CustomRadio
                checked={formData.proxyType === 'none'}
                onChange={(e) => handleProxyTypeChange(e.target.value)}
                value="none"
              >
                {t("settings.noProxy")}
              </CustomRadio>
              <CustomRadio
                checked={formData.proxyType === 'system'}
                onChange={(e) => handleProxyTypeChange(e.target.value)}
                value="system"
              >
                {t("settings.systemProxy")}
              </CustomRadio>
              <CustomRadio
                checked={formData.proxyType === 'custom'}
                onChange={(e) => handleProxyTypeChange(e.target.value)}
                value="custom"
              >
                {t("settings.customProxy")}
              </CustomRadio>
            </div>
            
            {formData.proxyType === 'custom' && (
              <div className="mt-2">
                <CustomTextArea
                  placeholder={t("settings.customProxyPlaceholder")}
                  value={formData.customProxy}
                  onChange={(e) => handleCustomProxyChange(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.proxyHint")}
                </p>
              </div>
              )}
            </div>
          )}

          {/* AI Provider Settings */}
          <div className="mt-4">
            <div className="mb-2 font-semibold">AI Provider</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CustomSelect
                value={provider}
                onChange={handleProviderChange}
                options={providerOptions}
              />
              <CustomInput
                value={apiKeys[provider] || ""}
                onChange={handleApiKeyChange}
                placeholder={"Enter API Key for " + provider}
              />
            </div>
            <div className="mt-2">
              <button onClick={handleSaveApi} className="px-3 py-1.5 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700">Save</button>
            </div>
            <div className="mt-2 text-xs">
              <a
                href={providerDocs[provider.replace(" (Gemini)", "")] || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View {providerOptions.find(p=>p.value===provider)?.label || provider} API docs
              </a>
            </div>
          </div>

          {/* Removed Default Model selection to centralize model choice in chat input */}
        </div>
      </div>
    </div>
  );
}
