import { AIProvider } from "@/stores/aiProviderSlice";

type Fetcher = (apiKey: string) => Promise<string[]>;

async function viaCF(provider: string, apiKey: string, baseUrl?: string): Promise<string[]> {
  const resp = await fetch(`/api/models/${provider}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ apiKey, baseUrl }),
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  return (data?.data || []) as string[];
}

const fetchOpenAIModels: Fetcher = async (apiKey) => {
  return viaCF('openai', apiKey);
};

const fetchAnthropicModels: Fetcher = async (apiKey) => {
  return viaCF('anthropic', apiKey);
};

const fetchGoogleModels: Fetcher = async (apiKey) => {
  return viaCF('google', apiKey);
};

const fetchGroqModels: Fetcher = async (apiKey) => {
  return viaCF('groq', apiKey);
};

const fetchDeepseekModels: Fetcher = async (apiKey) => {
  return viaCF('deepseek', apiKey);
};

const fetchOllamaModels: Fetcher = async (_apiKey) => {
  // Keep local direct call for Ollama
  try {
    const resp = await fetch("http://localhost:11434/api/tags");
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.models || []).map((m: any) => m.name as string);
  } catch { return []; }
};

const fetchAzureOpenAIModels: Fetcher = async (_apiKey) => {
  // Azure OpenAI requires resource endpoint and API version; can't list globally.
  // Return empty list by default; user should input deployment name manually.
  return [];
};

const fetchMistralModels: Fetcher = async (apiKey) => {
  return viaCF('mistral', apiKey);
};

const fetchCohereModels: Fetcher = async (apiKey) => {
  return viaCF('cohere', apiKey);
};

const fetchPerplexityModels: Fetcher = async (apiKey) => {
  return viaCF('perplexity', apiKey);
};

const fetchTogetherModels: Fetcher = async (apiKey) => {
  return viaCF('together', apiKey);
};

const fetchHuggingFaceModels: Fetcher = async (apiKey) => {
  return viaCF('huggingface', apiKey);
};

const fetchFireworksModels: Fetcher = async (apiKey) => {
  return viaCF('fireworks', apiKey);
};

const fetchOpenRouterModels: Fetcher = async (apiKey) => {
  return viaCF('openrouter', apiKey);
};

const fetchXaiModels: Fetcher = async (apiKey) => {
  return viaCF('xai', apiKey);
};

const fetchDeepInfraModels: Fetcher = async (apiKey) => {
  return viaCF('deepinfra', apiKey);
};

const fetchReplicateModels: Fetcher = async (apiKey) => {
  return viaCF('replicate', apiKey);
};

const fetchers: Record<AIProvider, Fetcher> = {
  openai: fetchOpenAIModels,
  anthropic: fetchAnthropicModels,
  google: fetchGoogleModels,
  groq: fetchGroqModels,
  deepseek: fetchDeepseekModels,
  ollama: fetchOllamaModels,
  "azure-openai": fetchAzureOpenAIModels,
  mistral: fetchMistralModels,
  cohere: fetchCohereModels,
  perplexity: fetchPerplexityModels,
  together: fetchTogetherModels,
  huggingface: fetchHuggingFaceModels,
  fireworks: fetchFireworksModels,
  openrouter: fetchOpenRouterModels,
  xai: fetchXaiModels,
  deepinfra: fetchDeepInfraModels,
  replicate: fetchReplicateModels,
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

