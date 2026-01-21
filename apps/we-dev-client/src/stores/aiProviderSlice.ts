import { create } from "zustand";

export type AIProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "groq"
  | "deepseek"
  | "ollama"
  | "azure-openai"
  | "mistral"
  | "cohere"
  | "perplexity"
  | "together"
  | "huggingface"
  | "fireworks"
  | "openrouter"
  | "xai"
  | "deepinfra"
  | "replicate";

export interface AIProviderState {
  provider: AIProvider;
  apiKeys: Partial<Record<AIProvider, string>>;
  availableModels: string[];
  selectedModel?: string;

  setProvider: (provider: AIProvider) => void;
  setApiKey: (provider: AIProvider, key: string) => void;
  setAvailableModels: (models: string[]) => void;
  setSelectedModel: (model?: string) => void;
  hydrateFromStorage: () => void;
}

const STORAGE_KEY = "aiProviderConfig";

export const useAIProviderStore = create<AIProviderState>((set, get) => ({
  provider: "openai",
  apiKeys: {},
  availableModels: [],
  selectedModel: undefined,

  setProvider: (provider) => {
    set({ provider });
    const snapshot = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        provider: snapshot.provider,
        apiKeys: snapshot.apiKeys,
        selectedModel: snapshot.selectedModel,
      })
    );
  },
  setApiKey: (provider, key) => {
    set((state) => ({ apiKeys: { ...state.apiKeys, [provider]: key } }));
    const snapshot = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        provider: snapshot.provider,
        apiKeys: { ...snapshot.apiKeys, [provider]: key },
        selectedModel: snapshot.selectedModel,
      })
    );
  },
  setAvailableModels: (models) => set({ availableModels: models }),
  setSelectedModel: (model) => {
    set({ selectedModel: model });
    const snapshot = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        provider: snapshot.provider,
        apiKeys: snapshot.apiKeys,
        selectedModel: model,
      })
    );
  },
  hydrateFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({
        provider: parsed.provider ?? "openai",
        apiKeys: parsed.apiKeys ?? {},
        selectedModel: parsed.selectedModel,
      });
    } catch {
      // ignore
    }
  },
}));

