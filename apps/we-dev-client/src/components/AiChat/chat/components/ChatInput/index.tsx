import React, { useRef, useState, useCallback, useEffect } from "react";
import { FileIcon, MessageSquare, Code2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { uploadImage } from "@/api/chat";
import classNames from "classnames";
import { useFileStore } from "../../../../WeIde/stores/fileStore";
import type { MentionOption } from "../MentionMenu";
import { ErrorDisplay } from "./ErrorDisplay";
import { ImagePreviewGrid } from "./ImagePreviewGrid";
import { UploadButtons } from "./UploadButtons";
import { SendButton } from "./SendButton";
import type { ChatInputProps as ChatInputPropsType } from "./types";
import { useTranslation } from "react-i18next";
import useChatModeStore from "../../../../../stores/chatModeSlice";
import useChatStore from "@/stores/chatSlice";
import useThemeStore from "@/stores/themeSlice";
import { v4 as uuidv4 } from "uuid";
import OptimizedPromptWord from "./OptimizedPromptWord";
import useUserStore from "@/stores/userSlice";
import { useAIProviderStore } from "@/stores/aiProviderSlice";
import { fetchModelsForProvider } from "@/api/models";
// import type { ModelOption } from './UploadButtons';

export enum ChatMode {
  Chat = "chat",
  Builder = "builder",
}
export const modePlaceholders = {
  [ChatMode.Chat]: "chat.modePlaceholders.chat",
  [ChatMode.Builder]: "chat.modePlaceholders.builder",
};
export const ChatInput: React.FC<ChatInputPropsType> = ({
  input,
  stopRuning,
  isLoading,
  isUploading,
  append,
  uploadedImages,
  setMessages,
  messages,
  handleInputChange,
  handleKeySubmit,
  handleSubmitWithFiles,
  handleFileSelect,
  removeImage,
  addImages,
  setInput,
  setIsUploading,
  handleSketchUpload,
  baseModal,
  setBaseModal,
}) => {
  const { files, errors, removeError } = useFileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sketchInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();
  const { user } = useUserStore();
  const {
    provider,
    availableModels,
    selectedModel,
    setProvider,
    setSelectedModel,
    setAvailableModels,
    apiKeys,
  } = useAIProviderStore();
  const providerOptions = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google" },
    { value: "groq", label: "Groq" },
    { value: "deepseek", label: "DeepSeek" },
    { value: "ollama", label: "Ollama" },
    { value: "azure-openai", label: "Azure" },
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

  const [combinedModels, setCombinedModels] = React.useState<Array<{ provider: string; id: string; label: string }>>([]);
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

  const loadProviderModels = React.useCallback(async (prov: string) => {
    const key = (apiKeys as any)[prov] || "";
    const needsKey = ["openai", "anthropic", "google", "groq", "azure-openai", "mistral", "cohere", "perplexity", "together", "huggingface", "fireworks", "openrouter", "xai", "deepinfra", "replicate"].includes(prov);
    if (needsKey && !key) return [] as string[];
    const list = await fetchModelsForProvider(prov as any, key);
    return list;
  }, [apiKeys]);

  const refreshCombined = React.useCallback(async () => {
    const out: Array<{ provider: string; id: string; label: string }> = [];
    for (const p of providerOptions) {
      const models = await loadProviderModels(p.value);
      models.forEach((m) => out.push({ provider: p.value, id: m, label: `${p.label} · ${m}` }));
    }
    setCombinedModels(out);
    if (!selectedModel && out.length) {
      setProvider(out[0].provider as any);
      setSelectedModel(out[0].id);
      setAvailableModels(out.filter(x => x.provider === out[0].provider).map(x => x.id));
    }
  }, [loadProviderModels, providerOptions, selectedModel, setProvider, setSelectedModel, setAvailableModels]);

  useEffect(() => {
    refreshCombined();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [filteredMentionOptions, setFilteredMentionOptions] = useState<
    MentionOption[]
  >([]);
  const [highlightRange, setHighlightRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [mentions, setMentions] = useState<
    Array<{ start: number; end: number; path: string }>
  >([]);
  const { mode: chatMode, setMode } = useChatModeStore();
  const { isDarkMode } = useThemeStore();

  const getFileOptions = () => {
    return Object.entries(files).map(([path]) => ({
      id: path,
      icon: <FileIcon />,
      label: path,
      path: path,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      e.preventDefault(); // 阻止默认行为
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      const cursorPosition = e.currentTarget.selectionStart;
      const mention = mentions.find((m) => m.end === cursorPosition);

      if (mention) {
        e.preventDefault();
        const newValue =
          input.slice(0, mention.start) + input.slice(mention.end);
        const event = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        handleInputChange(event);
        setHighlightRange(null);
        setMentions(mentions.filter((m) => m !== mention));
        return;
      }
    }

    if (e.key === "Enter") {
      setHighlightRange(null);
    }

    if (showMentionMenu) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev < filteredMentionOptions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (
          filteredMentionOptions.length > 0 &&
          filteredMentionOptions[selectedMentionIndex]
        ) {
          handleMentionSelect(filteredMentionOptions[selectedMentionIndex]);
        }
      } else if (e.key === "Escape") {
        setShowMentionMenu(false);
      }
    } else {
      handleKeySubmit(e);
    }
  };

  const debounce = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: unknown[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const getCursorPosition = (textarea: HTMLTextAreaElement) => {
    const style = window.getComputedStyle(textarea);
    const pos = textarea.selectionStart || 0;

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.width = style.width;
    div.style.padding = style.padding;
    div.style.font = style.font;
    div.style.lineHeight = style.lineHeight;

    const textBeforeCursor = textarea.value.substring(0, pos);
    const textAfterCursor = textarea.value.substring(pos);

    const beforeNode = document.createTextNode(textBeforeCursor);
    div.appendChild(beforeNode);

    const cursorNode = document.createElement("span");
    cursorNode.textContent = "|";
    div.appendChild(cursorNode);

    const afterNode = document.createTextNode(textAfterCursor);
    div.appendChild(afterNode);

    document.body.appendChild(div);

    const cursorRect = cursorNode.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();

    document.body.removeChild(div);

    const relativeTop = cursorRect.top - textareaRect.top + textarea.scrollTop;
    const relativeLeft = cursorRect.left - textareaRect.left;

    const maxTop = textarea.offsetHeight - 200;
    const adjustedTop = Math.min(relativeTop, maxTop);

    return {
      left: relativeLeft,
      top: adjustedTop,
      height: parseFloat(style.lineHeight) || 20,
    };
  };

  const updateMentionPosition = useCallback(() => {
    if (!showMentionMenu || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const { left, top, height } = getCursorPosition(textarea);
    const textareaRect = textarea.getBoundingClientRect();
    const menuWidth = 200;

    const adjustedLeft = Math.min(left, textareaRect.width - menuWidth - 10);

    setMentionPosition({
      top: top + height,
      left: adjustedLeft,
    });
  }, [showMentionMenu]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const oldValue = input;
      handleInputChange(e);

      if (newValue.length < oldValue.length) {
        const deletedStart = e.target.selectionStart;
        const mention = mentions.find(
          (m) => deletedStart > m.start && deletedStart < m.end
        );

        if (mention) {
          e.preventDefault();
          return;
        }

        const diff = oldValue.length - newValue.length;
        const updatedMentions = mentions.map((m) => {
          if (m.start > deletedStart) {
            return {
              ...m,
              start: m.start - diff,
              end: m.end - diff,
            };
          }
          return m;
        });
        setMentions(updatedMentions);
      }

      const lastAtIndex = newValue.lastIndexOf("@");
      const textAfterLastAt = newValue.substring(lastAtIndex + 1);

      if (lastAtIndex !== -1 && !textAfterLastAt.includes(" ")) {
        const searchTerm = textAfterLastAt.toLowerCase();
        const fileOptions = getFileOptions();
        const filteredOptions = fileOptions.filter(
          (option) =>
            option.label.toLowerCase().includes(searchTerm) ||
            option.path?.toLowerCase().includes(searchTerm)
        );

        if (filteredOptions.length > 0) {
          updateMentionPosition();
          setFilteredMentionOptions(filteredOptions);
          setShowMentionMenu(true);
          setSelectedMentionIndex(0);
        } else {
          setShowMentionMenu(false);
        }
      } else {
        setShowMentionMenu(false);
      }
    },
    [input, mentions, handleInputChange, updateMentionPosition]
  );

  const handleMentionSelect = (option: MentionOption) => {
    const textarea = textareaRef.current;
    if (!textarea || !option.path) return;

    const cursorPosition = textarea.selectionEnd;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const textAfterCursor = textarea.value.substring(cursorPosition);

    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex === -1) return;

    const mentionText = `@${option.path} `;
    const newValue =
      textBeforeCursor.substring(0, lastAtIndex) +
      mentionText +
      textAfterCursor;

    const newMention = {
      start: lastAtIndex,
      end: lastAtIndex + mentionText.length,
      path: option.path,
    };
    setMentions([...mentions, newMention]);

    setHighlightRange({
      start: lastAtIndex,
      end: lastAtIndex + (option.path?.length || 0) + 1,
    });

    const event = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    handleInputChange(event);
    setShowMentionMenu(false);
  };

  const handlePaste = async (e: ClipboardEvent) => {
    console.log(baseModal, "useImage");
    if (!baseModal.useImage) return;
    if (isUploading) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(
      (item) => item.type.indexOf("image") !== -1
    );

    if (imageItems.length > 0) {
      e.preventDefault();
      setIsUploading(true);

      try {
        const uploadResults = await Promise.all(
          imageItems.map(async (item) => {
            const file = item.getAsFile();
            if (!file) throw new Error("Failed to get file from clipboard");

            const url = await uploadImage(file);
            return {
              id: uuidv4(),
              file,
              url,
              localUrl: URL.createObjectURL(file),
              status: "done" as const,
            };
          })
        );

        addImages(uploadResults);

        if (uploadResults.length === 1) {
          toast.success("Image pasted successfully");
        } else {
          toast.success(`${uploadResults.length} images pasted successfully`);
        }
      } catch (error) {
        console.error("Failed to upload pasted images:", error);
        toast.error("Failed to upload pasted images");
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener("paste", handlePaste);
    return () => {
      textarea.removeEventListener("paste", handlePaste);
    };
  }, [isUploading, baseModal?.label]);

  useEffect(() => {
    if (showMentionMenu) {
      updateMentionPosition();
    }
  }, [input, showMentionMenu, updateMentionPosition]);

  useEffect(() => {
    const handleResize = debounce(() => {
      if (showMentionMenu) {
        updateMentionPosition();
      }
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showMentionMenu, updateMentionPosition]);

  return (
    <div className="px-1 py-2 ">
      <div className="max-w-[640px] w-full mx-auto bg-[#fff] dark:bg-[#18181a]">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <select
            className="px-2 py-1 rounded border border-gray-600/30 bg-transparent w-full"
            value={selectedModel || ""}
            onChange={(e) => {
              const id = e.target.value;
              const entry = combinedModels.find((x) => x.id === id);
              if (!entry) return;
              setProvider(entry.provider as any);
              setSelectedModel(entry.id);
              const modelsForProv = combinedModels.filter(x => x.provider === entry.provider).map(x => x.id);
              setAvailableModels(modelsForProv);
            }}
          >
            <option value="" disabled>select model (provider · model)</option>
            {combinedModels.map((m) => (
              <option key={`${m.provider}:${m.id}`} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>
        {selectedModel && (
          <div className="-mt-1 mb-2 text-[10px] text-right">
            <a
              href={providerDocs[provider] || '#'}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Provider API docs
            </a>
          </div>
        )}
        <ErrorDisplay
          errors={errors}
          onAttemptFix={async (error, index) => {
            const errorText = `Please help me fix this error:\n${error.code}`;
            handleSubmitWithFiles(null, errorText);
            removeError(index);
          }}
          onRemoveError={removeError}
        />

        <ImagePreviewGrid
          uploadedImages={uploadedImages}
          onRemoveImage={removeImage}
        />

          <div className="flex flex-row">
        <OptimizedPromptWord input={input} setInput={setInput}></OptimizedPromptWord>
        </div>

        <div className="relative bg-transparent dark:bg-[#1a1a1c] rounded-lg border border-gray-600/30">
          <div
            className={classNames(
              "relative",
              isUploading && "opacity-50 pointer-events-none"
            )}
          >
            {isUploading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 border-2 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
              </div>
            )}
            <div className="relative ">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t(
                  chatMode === ChatMode.Chat
                    ? t(modePlaceholders[ChatMode.Chat])
                    : t(modePlaceholders[ChatMode.Builder])
                )}
                className={classNames(
                  "w-full p-4 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none resize-none text-sm",
                  "placeholder-gray-500 dark:placeholder-gray-400",
                  "hover:bg-gray-50/50 dark:hover:bg-white/[0.03]",
                  "focus:bg-gray-50/80 dark:focus:bg-white/[0.05]",
                  "transition-colors duration-200",
                  "relative z-10",
                  isLoading && "opacity-50"
                )}
                rows={3}
                style={{
                  minHeight: "60px",
                  maxHeight: "200px",
                  caretColor: isDarkMode ? "white" : "black",
                }}
                disabled={isLoading}
              />

              {highlightRange && (
                <div
                  className="absolute top-0 bottom-0 left-0 right-0 p-4 text-sm break-words whitespace-pre-wrap pointer-events-none"
                  style={{
                    fontFamily: "inherit",
                    lineHeight: "inherit",
                    overflow: "hidden",
                  }}
                >
                  <span className="invisible">
                    {input.substring(0, highlightRange.start)}
                  </span>
                  <span className="text-transparent bg-blue-500/20">
                    {input.substring(highlightRange.start, highlightRange.end)}
                  </span>
                  <span className="invisible">
                    {input.substring(highlightRange.end)}
                  </span>
                </div>
              )}
            </div>

            {showMentionMenu && (
              <div
                className="absolute z-50 transition-all duration-100"
                style={{
                  top: `${mentionPosition.top + 100}px`,
                  left: `${mentionPosition.left + 40}px`,
                  maxHeight: "200px",
                  width: "200px",
                }}
              >
                <div className="dark:bg-[#1c1c1c] bg-transparent rounded-md border border-gray-600/30 shadow-lg overflow-hidden">
                  <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent">
                    {filteredMentionOptions.map((option, index) => (
                      <div
                        key={option.id}
                        className={classNames(
                          "px-2 py-1.5 flex items-center gap-2 text-xs cursor-pointer",
                          selectedMentionIndex === index
                            ? "bg-blue-500/20 text-blue-400"
                            : "text-gray-300 hover:bg-gray-700/30"
                        )}
                        onClick={() => {
                          handleMentionSelect(option);
                        }}
                        ref={
                          index === selectedMentionIndex
                            ? (el) => {
                                if (el) {
                                  el.scrollIntoView({ block: "nearest" });
                                }
                              }
                            : null
                        }
                      >
                        {option.icon}
                        <span className="truncate">{option.path}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}


            <div className="flex items-center justify-between px-2 py-2 border-t border-gray-600/30">
              <div className="flex items-center">
                <UploadButtons
                  isLoading={isLoading}
                  isUploading={isUploading}
                  baseModal={baseModal}
                  setMessages={setMessages}
                  append={append}
                  messages={messages}
                  setBaseModal={setBaseModal}
                  handleSubmitWithFiles={handleSubmitWithFiles}
                  onImageClick={() => fileInputRef.current?.click()}
                  onSketchClick={() => sketchInputRef.current?.click()}
                />

                <button
                  className={classNames(
                    "p-2 rounded-md transition-colors",
                    "hover:bg-gray-700/30",
                    "group relative"
                  )}
                  onClick={() => {
                    setMode(
                      chatMode === ChatMode.Chat
                        ? ChatMode.Builder
                        : ChatMode.Chat
                    );
                  }}
                >
                  {chatMode === ChatMode.Chat ? (
                    <MessageSquare
                      className={classNames("w-4 h-4", "text-blue-400")}
                    />
                  ) : (
                    <Code2 className={classNames("w-4 h-4", "text-blue-400")} />
                  )}
                  <span className="absolute px-2 py-1 mb-2 text-xs text-gray-200 transition-opacity -translate-x-1/2 bg-gray-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                    {chatMode}
                  </span>
                </button>
              </div>

              <SendButton
                isLoading={isLoading}
                stop={stopRuning}
                isUploading={isUploading}
                hasInput={!!(input?.trim())}
                hasUploadingImages={uploadedImages.some(
                  (img) => img.status === "uploading"
                )}
                onClick={handleSubmitWithFiles}
              />
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*"
        />
        
        {/* fileInputRef这个应该是没有用的（没验证） */}
        <input
          ref={sketchInputRef}
          type="file"
          onChange={handleSketchUpload}
          className="hidden"
          accept=".sketch"
        />
      </div>
    </div>
  );
};
