export const onRequest: PagesFunction = async (context) => {
  const { params, request } = context as any;
  const provider = params.provider as string;

  try {
    const { apiKey, baseUrl } = await request.json();
    const upstream = getUpstream(provider, baseUrl);
    if (!upstream) {
      return new Response(JSON.stringify({ error: "Unsupported provider" }), { status: 400, headers: corsHeaders() });
    }

    const { url, headers } = upstream(apiKey);
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      return new Response(JSON.stringify({ data: [] }), { status: 200, headers: corsHeaders() });
    }
    const data = await resp.json();
    const list = normalizeModels(provider, data);
    return new Response(JSON.stringify({ data: list }), { status: 200, headers: corsHeaders() });
  } catch (e) {
    return new Response(JSON.stringify({ data: [] }), { status: 200, headers: corsHeaders() });
  }
};

function corsHeaders() {
  return {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
}

function getUpstream(provider: string, baseUrl?: string) {
  const map: Record<string, (apiKey: string) => { url: string; headers: Record<string, string> }> = {
    openai: (k) => ({ url: `${baseUrl || "https://api.openai.com"}/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    anthropic: (k) => ({ url: `https://api.anthropic.com/v1/models`, headers: { "x-api-key": k, "anthropic-version": "2023-06-01" } }),
    google: (k) => ({ url: `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(k)}`, headers: {} }),
    groq: (k) => ({ url: `https://api.groq.com/openai/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    deepseek: (k) => ({ url: `https://api.deepseek.com/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    mistral: (k) => ({ url: `https://api.mistral.ai/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    cohere: (k) => ({ url: `https://api.cohere.ai/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    perplexity: (k) => ({ url: `https://api.perplexity.ai/models`, headers: { Authorization: `Bearer ${k}` } }),
    together: (k) => ({ url: `https://api.together.xyz/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    huggingface: (k) => ({ url: `https://huggingface.co/api/models?limit=100`, headers: k ? { Authorization: `Bearer ${k}` } : {} }),
    fireworks: (k) => ({ url: `https://api.fireworks.ai/inference/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    openrouter: (k) => ({ url: `https://openrouter.ai/api/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    xai: (k) => ({ url: `https://api.x.ai/v1/models`, headers: { Authorization: `Bearer ${k}` } }),
    deepinfra: (k) => ({ url: `https://api.deepinfra.com/v1/openai/models`, headers: { Authorization: `Bearer ${k}` } }),
    replicate: (k) => ({ url: `https://api.replicate.com/v1/models?limit=100`, headers: { Authorization: `Bearer ${k}` } }),
  };
  return map[provider];
}

function normalizeModels(provider: string, data: any): string[] {
  switch (provider) {
    case "openai":
    case "groq":
    case "fireworks":
    case "openrouter":
    case "xai":
    case "deepinfra":
      return (data?.data || []).map((m: any) => m.id).filter(Boolean);
    case "anthropic":
      return (data?.data || []).map((m: any) => m.id).filter((id: string) => !!id);
    case "google":
      return (data?.models || []).map((m: any) => m.name).filter(Boolean);
    case "mistral":
      return (data?.data || []).map((m: any) => m.id).filter(Boolean);
    case "cohere":
      return (data?.models || []).map((m: any) => m.name).filter(Boolean);
    case "perplexity":
      return (data?.models || []).map((m: any) => m.id).filter(Boolean);
    case "together":
      return (data?.data || []).map((m: any) => m.id).filter(Boolean);
    case "huggingface":
      return (data || []).map((m: any) => m.modelId).filter(Boolean);
    case "replicate":
      return (data?.results || []).map((m: any) => (m?.owner && m?.name ? `${m.owner}/${m.name}` : undefined)).filter(Boolean);
    case "deepseek":
      return (data?.data || []).map((m: any) => m.id).filter(Boolean);
    default:
      return [];
  }
}

