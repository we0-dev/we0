import { message } from "antd";

interface TokenUsage {
  tokensUsed: number;
  monthlyLimit: number;
  monthYear: string;
}

export async function getTokenUsage(token: string): Promise<TokenUsage | null> {
  try {
    const BASE = process.env.APP_BASE_URL || "";
    const response = await fetch(`${BASE}/api/tokens`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token usage");
    }
    return await response.json();
  } catch (error) {
    message.error("获取使用量失败");
    return null;
  }
}
