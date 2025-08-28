import { AIProvider } from "@/stores/aiProviderSlice";

type Fetcher = (apiKey: string) => Promise<string[]>;

const fetchOpenAIModels: Fetcher = async (apiKey) => {
  const resp = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  return (data.data || [])
    .map((m: any) => m.id as string)
    .filter((id: string) => /gpt|o|mini|4|3\.5|text-/.test(id));
};

const fetchAnthropicModels: Fetcher = async (apiKey) => {
  const resp = await fetch("https://api.anthropic.com/v1/models", {
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  return (data.data || [])
    .map((m: any) => m.id as string)
    .filter((id: string) => /claude/.test(id));
};

const fetchGoogleModels: Fetcher = async (apiKey) => {
  // Gemini list via AI Studio REST (public models)
  const resp = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey
  );
  if (!resp.ok) return [];
  const data = await resp.json();
  return (data.models || []).map((m: any) => m.name as string);
};

const fetchGroqModels: Fetcher = async (apiKey) => {
  const resp = await fetch("https://api.groq.com/openai/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  return (data.data || []).map((m: any) => m.id as string);
};

const fetchDeepseekModels: Fetcher = async (apiKey) => {
  // DeepSeek OpenAI-compatible endpoint (requires API key and proper base URL via proxy or env)
  // If you expose a proxy at /api/deepseek, adapt accordingly. Here we attempt the official endpoint.
  try {
    const resp = await fetch("https://api.deepseek.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!resp.ok) return ["deepseek-chat", "deepseek-reasoner", "DeepSeek-R1"];
    const data = await resp.json();
    return (data.data || []).map((m: any) => m.id as string);
  } catch {
    return ["deepseek-chat", "deepseek-reasoner", "DeepSeek-R1"];
  }
};

const fetchOllamaModels: Fetcher = async (_apiKey) => {
  try {
    const resp = await fetch("http://localhost:11434/api/tags");
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.models || []).map((m: any) => m.name as string);
  } catch {
    return [];
  }
};

const fetchAzureOpenAIModels: Fetcher = async (_apiKey) => {
  // Azure OpenAI requires resource endpoint and API version; can't list globally.
  // Return empty list by default; user should input deployment name manually.
  return [];
};

const fetchers: Record<AIProvider, Fetcher> = {
  openai: fetchOpenAIModels,
  anthropic: fetchAnthropicModels,
  google: fetchGoogleModels,
  groq: fetchGroqModels,
  deepseek: fetchDeepseekModels,
  ollama: fetchOllamaModels,
  "azure-openai": fetchAzureOpenAIModels,
};

export async function fetchModelsForProvider(
  provider: AIProvider,
  apiKey?: string
): Promise<string[]> {
  const key = apiKey || "";
  try {
    return await fetchers[provider](key);
  } catch {
    return [];
  }
}

